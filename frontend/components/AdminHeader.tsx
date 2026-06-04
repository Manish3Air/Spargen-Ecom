"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
// import Link from "next/link";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
          Admin
        </p>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Spargen Console
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label="Toggle admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
