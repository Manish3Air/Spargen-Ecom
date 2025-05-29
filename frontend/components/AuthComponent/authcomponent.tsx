"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import { AuroraText } from "../magicui/aurora-text";
import Image from "next/image";

export default function AuthMenu() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on navigation
  useEffect(() => {
    // const handleRouteChange = () => setOpen(false);
    router.prefetch("/login"); // Optional prefetching
    router.prefetch("/register");
  }, [router]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {currentUser?.avatar && (
          <div className="flex justify-center">
            <Image
            src={currentUser.avatar}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full shadow-md object-cover border-1 border-black"
            />
          </div>
        )}
        <User className="w-5 h-5" />
        {currentUser?.name && (
          <p className="sm:inline">
            Hi, <AuroraText>{currentUser.name.split(" ")[0]}</AuroraText>
          </p>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {currentUser ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                👤 Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                📝 Register
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      )}

    </div>
  );
}
