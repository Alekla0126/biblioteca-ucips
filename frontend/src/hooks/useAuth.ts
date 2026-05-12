import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { onAuthChange } from "@/lib/firebase";
import api, { ApiError } from "@/lib/api";
import type { AppUser } from "@/types";

export function useAuthInit() {
  const { setFirebaseUser, setAppUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: import("firebase/auth").User | null) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await api.post<AppUser>("auth/login");
          setAppUser(res.data);
        } catch (err: unknown) {
          if (err instanceof ApiError && err.status === 404) {
            try {
              const res = await api.post<AppUser>("auth/register");
              setAppUser(res.data);
            } catch {
              setAppUser(null);
            }
          } else {
            setAppUser(null);
          }
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
  const isAdmin = appUser?.role === "admin";
  const isProfesor = appUser?.role === "profesor";
  return {
    firebaseUser,
    appUser,
    loading,
    isAdmin,
    isProfesor,
    canUpload: isAdmin || isProfesor,
    isAuthenticated: !!firebaseUser,
  };
}
