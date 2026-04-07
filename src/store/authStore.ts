import { create } from "zustand";

type AuthState = {
  user: string | null;
  setUser: (user: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
    loading: false,
    setLoading: (loading) => set({ loading }),
}));
