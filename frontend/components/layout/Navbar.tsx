"use client";
import Link from "next/link";
import VoiceSearch from "../shared/VoiceSearch";
import { useRouter } from "next/navigation";
// import { AuroraBackground } from "magic-ui";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { VideoText } from "@/components/magicui/video-text";
import  AuthComponent  from "../AuthComponent/authcomponent";

const Navbar = () => {
  const router = useRouter();
  // const { currentUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleVoiceSearch = (query: string) => {
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

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
        className="hover:text-white hover:bg-black px-2 py-1 rounded-xl transition text-lg font-semibold"
      >
        Products
      </Link>
      <Link
        href="/cart"
        className="hover:text-white hover:bg-black px-4 py-1 rounded-xl transition text-lg font-semibold"
      >
        Cart
      </Link>
      <Link
        href="/wishlist"
        className="hover:text-white hover:bg-black px-2 py-1 rounded-xl transition text-lg font-semibold"
      >
        Wishlist
      </Link>
      <VoiceSearch onSearch={handleVoiceSearch} />
    </>
  );

  return (
    <nav className=" sticky top-0 z-50 w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-2 rounded-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto  px-4 py-2 rounded-lg">
        <Link href={"/"}>
        <div className="relative h-[50px] w-[180px] overflow-hidden">
          <VideoText src="https://cdn.magicui.design/ocean-small.webm" className="font-bold text-2xl">
            SPARGEN
          </VideoText>
        </div>
        </Link>
        

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <NavLinks />
          <AuthComponent />
          <button onClick={toggleTheme}>
            {darkMode ? (
              <Moon className="w-5 h-5 text-lg" />
            ) : (
              <Sun className="w-5 h-5 text-lg" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme}>
            {darkMode ? (
              <Sun className="w-5 h-5 text-lg" />
            ) : (
              <Moon className="w-5 h-5 text-lg" />
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden text-sm font-medium">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
