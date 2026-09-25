import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAuth: (accessToken: string, user: User) => set({ accessToken, user, isAuthenticated: true }),
  setToken: (accessToken: string) => set({ accessToken }),
  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));
