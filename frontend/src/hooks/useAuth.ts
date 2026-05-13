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

      if (!firebaseUser) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.post<AppUser>("auth/login");
        setAppUser(res.data);
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            // New user — register them in the backend
            try {
              const res = await api.post<AppUser>("auth/register");
              setAppUser(res.data);
            } catch {
              setAppUser(null);
            }
          } else if (err.status === 401) {
            // Token revoked or invalid — clear session
            setAppUser(null);
          }
          // For 5xx / network errors: keep existing cached appUser (from localStorage)
          // so transient backend issues don't wipe the user's role on screen
        }
      } finally {
        setLoading(false);
      }
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
    // Use persisted appUser as fallback while Firebase initialises (~500 ms delay)
    // so cached role is visible immediately on page load without a flash
    isAuthenticated: !!firebaseUser || !!appUser,
  };
}
