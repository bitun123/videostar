import { create } from "zustand";

type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
