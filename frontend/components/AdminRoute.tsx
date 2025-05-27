"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("authUser");
      if (!stored) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(stored);
      if (user.role !== "admin") {
        alert("Unauthorized: Admin access only");
        router.push("/login");
        return;
      }
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth || !currentUser) return null;

  // Optional double-check with currentUser from context
  if (currentUser.role !== "admin") {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
}
