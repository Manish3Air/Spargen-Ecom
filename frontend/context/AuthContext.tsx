"use client";

import BASE_URL from "@/utils/api";
import {CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "sonner";

// --- Types ---
interface User {
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar?: string;
}

type LoginResponse = {
  token: string;
  user: User;
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<LoginResponse | null>;
  register: (user: User) => Promise<boolean>;
  logout: () => void;
  handleGoogleLogin: (credentialResponse: CredentialResponse) => Promise<void>; // ✅ added to context
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Restore user on load
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("authToken");
    if (storedUser && token) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Login ---
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed");
      return null;
    }
  };

  // --- Register ---
  const register = async (user: User): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (!res.ok) return false;

      console.log("Registration successful:", data);
      return true;
    } catch (err) {
      console.error("Register failed:", err);
      return false;
    }
  };

  // --- Google auth Login ---
  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    if (!credentialResponse.credential) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      });

      const { user, token } = res.data;

      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      setCurrentUser(user);

      if (user.role === "admin") {
        toast.success("🎉 Google login successful, Admin logged in!");
        router.push("/admin");
      } else {
        toast.success("🎉 Google login successful");
        router.push("/");
      }

      router.push("/");
    } catch (err) {
      console.error("Google login failed", err);
      toast.error("❌ Google login failed");
    }
  };

  // --- Logout ---
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        handleGoogleLogin, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
