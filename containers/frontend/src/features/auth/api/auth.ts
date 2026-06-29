import apiClient from '@/lib/api/client';

const setTokens = (tokens: { token: string; refreshToken: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', tokens.token);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }
};

const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  const response = await apiClient.post('/auth/login', { email, password });
  const data = response.data;
  if (data?.accessToken) {
    setTokens({ token: data.accessToken, refreshToken: data.refreshToken });
    return data;
  }
  throw new Error('فشل تسجيل الدخول');
};

export const register = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<any> => {
  const response = await apiClient.post('/auth/register', {
    email: userData.email,
    password: userData.password,
    displayName: userData.name,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  try { await apiClient.post('/auth/logout'); } catch {}
  clearTokens();
  if (typeof window !== 'undefined') window.location.href = '/ar/auth/login';
};

export const refreshToken = async () => {
  const rt = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  if (!rt) return null;
  const response = await apiClient.post('/auth/refresh', { refreshToken: rt });
  const data = response.data;
  if (data?.accessToken) {
    const tokens = { token: data.accessToken, refreshToken: data.refreshToken };
    setTokens(tokens);
    return tokens;
  }
  return null;
};