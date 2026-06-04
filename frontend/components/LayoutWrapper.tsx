"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Don't show Navbar and Footer for admin routes
  const isAdminRoute = pathname?.startsWith("/admin");
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
