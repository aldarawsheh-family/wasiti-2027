// WASITI 2027 â€” Auth Store (Zustand + Persist)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, register as registerApi, logout as logoutApi, refreshToken } from '@/features/auth/api/auth';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  // refreshToken via httpOnly cookie
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const data = await loginApi(email, password);
          // ط®ط²ظ‘ظ† ظپظٹ cookie ظ„ظ„ظ…iddleware
          document.cookie = `auth_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
          set({
            user: data.user,
            accessToken: data.accessToken,
            // refreshToken via httpOnly cookie
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
        document.cookie = 'auth_token=; path=/; max-age=0';
        set({ user: null, accessToken: null, refreshToken: null });
      },

      refresh: async () => {
        const data = await refreshToken();
        if (data) {
          document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          set({
            accessToken: data.token,
            // refreshToken via httpOnly cookie
          });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        // refreshToken via httpOnly cookie
      }),
    }
  )
);
