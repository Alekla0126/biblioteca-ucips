import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "firebase/auth";
import type { AppUser } from "@/types";

interface AuthState {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  setFirebaseUser: (user: User | null) => void;
  setAppUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      appUser: null,
      loading: true,
      setFirebaseUser: (user) => set({ firebaseUser: user }),
      setAppUser: (user) => set({ appUser: user }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ firebaseUser: null, appUser: null, loading: false }),
    }),
    {
      name: "biblioteca-auth",
      partialize: (state) => ({ appUser: state.appUser }),
    }
  )
);
