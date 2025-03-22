import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  institution: string;
  specialization?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setHydrated: (state: boolean) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  institution: string;
  role: "student" | "instructor";
  specialization?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isHydrated: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting login...", { email });
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
          }

          const { user, token } = await response.json();
          console.log("Login successful:", { userId: user._id });
          set({
            user,
            token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting registration...", { email: data.email });
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Registration failed");
          }

          const { user, token } = await response.json();
          console.log("Registration successful:", { userId: user._id });
          set({
            user,
            token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Registration error:", error);
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },
      logout: async () => {
        console.log("Logging out...");
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${useAuth.getState().token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Logout failed");
          }

          set({ user: null, token: null, isLoading: false });
          console.log("Logged out successfully");
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
            isLoading: false,
          });
          throw error;
        }
      },
      setUser: (user: User | null) => {
        console.log("Updating user:", { userId: user?._id });
        set({ user });
      },
      setHydrated: (state: boolean) => set({ isHydrated: state }),
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
