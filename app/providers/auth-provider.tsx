"use client";

import { useEffect } from "react";
import { useAuth, checkAuthStatus } from "../hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setHydrated } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setHydrated(true);
    };

    initAuth();
  }, [setHydrated]);

  return <>{children}</>;
}
