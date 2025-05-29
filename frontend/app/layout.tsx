import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar"; // ✅ Add this
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from "@react-oauth/google";







const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spargen-Ecom",
  description: "E-commerce site for mobiles & tablets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e0e5ec]`}
      >
        <AuthProvider>
        <WishlistProvider>
        <CartProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <Toaster position="top-right" richColors closeButton duration={2000} />
          <GoogleOAuthProvider clientId="62706392850-ash0arg9fmoulodkkorppsv4hi1l6qet.apps.googleusercontent.com">
          <main> {children}</main>
          </GoogleOAuthProvider>
          <Footer />
        </Suspense>
        </CartProvider>
        </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
