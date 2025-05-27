"use client";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import ClientVideoText from "@/components/ClientVideoText";
import AuthComponent from "../AuthComponent/authcomponent";
import SearchBar from "../layout/SearchBar";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const NavLinks = () => (
    <>
      <Link
        href="/products"
        className="hover:text-black hover:bg-[#f0f5ff] px-2 py-1 rounded-xl transition text-lg font-semibold"
      >
        Products
      </Link>
      <Link
        href="/cart"
        className="hover:text-black hover:bg-[#f0f5ff] px-4 py-1 rounded-xl transition text-lg font-semibold"
      >
        Cart
      </Link>
      <Link
        href="/wishlist"
        className="hover:text-black hover:bg-[#f0f5ff] px-2 py-1 rounded-xl transition text-lg font-semibold"
      >
        Wishlist
      </Link>
    </>
  );

  return (
    <nav className="sticky border-2 top-0 z-50 w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/40 text-gray-800 dark:text-white shadow-md sm:shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
    {/* Logo */}
    <Link href={"/"} className="shrink-0">
      <div className="relative h-[50px] w-[150px] sm:w-[180px] overflow-hidden">
        <ClientVideoText
          src="https://cdn.magicui.design/ocean-small.webm"
          className="font-bold text-xl sm:text-2xl"
        >
          SPARGEN
        </ClientVideoText>
      </div>
    </Link>

    {/* Search Bar - full width on small screens */}
    
    <div className="w-full order-3 md:order-none md:flex-1">
      <SearchBar />
    </div>
    

    {/* Desktop Nav */}
    <div className="hidden lg:flex items-center gap-5 text-sm font-medium shrink-0">
      <NavLinks />
      <AuthComponent />
      <button onClick={toggleTheme}>
        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
    </div>

    {/* Mobile Buttons */}
    <div className="flex lg:hidden items-center gap-2 shrink-0">
      <button onClick={toggleTheme}>
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </div>

  {/* Mobile Nav Dropdown */}
  {menuOpen && (
    <div className="flex flex-col gap-4 mt-2 px-4 pb-4 lg:hidden text-sm font-medium">
      <NavLinks />
      <AuthComponent />
    </div>
  )}
</nav>

  );
};

export default Navbar;
