import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { onAuthChange } from "@/lib/firebase";
import api from "@/lib/api";
import type { AppUser } from "@/types";

export function useAuthInit() {
  const { setFirebaseUser, setAppUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await api.post<AppUser>("/auth/login");
          setAppUser(res.data);
        } catch {
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setFirebaseUser, setAppUser, setLoading]);
}

export function useAuth() {
  const { firebaseUser, appUser, loading } = useAuthStore();
  return {
    firebaseUser,
    appUser,
    loading,
    isAdmin: appUser?.role === "admin",
    isAuthenticated: !!firebaseUser,
  };
}
