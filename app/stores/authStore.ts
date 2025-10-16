import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  admin: {
    id: string;
    email: string;
  } | null;
  login: (admin: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,

      login: (admin) => set({ isAuthenticated: true, admin }),

      logout: () => set({ isAuthenticated: false, admin: null }),
    }),
    {
      name: "admin-auth-storage",
    }
  )
);
