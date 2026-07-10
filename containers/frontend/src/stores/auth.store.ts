// WASITI 2027 — Auth Store (Zustand + Persist)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, register as registerApi, logout as logoutApi, refreshToken } from '@/features/auth/api/auth';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: string[];
  tenantType: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const data = await loginApi(email, password);
          set({
            user: {
              ...data.user,
              permissions: data.user.permissions || [],
              tenantType: data.user.tenantType || null,
            },
            accessToken: data.accessToken,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          await registerApi(data);
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        await logoutApi();
        set({ user: null, accessToken: null });
      },

      refresh: async () => {
        const data = await refreshToken();
        if (data) {
          set({ accessToken: data.token });
        }
      },

      setUser: (user) => set({ user }),

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'PLATFORM_OWNER') return true;
        return user.permissions?.includes(permission) || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);