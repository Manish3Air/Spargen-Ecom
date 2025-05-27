"use client"
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Scroll to top logic
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full p-6 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-400 border-2 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mobile Plaza</h2>
          <p className="text-sm mt-2">© {new Date().getFullYear()} All rights reserved.</p>
          <p className="text-xs mt-1 text-gray-500">Crafted by Manish.</p>
        </div>

        {/* Newsletter */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Subscribe to our Newsletter</h3>
          <form className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Follow Us</h3>
          <div className="mt-4 flex justify-center md:justify-end space-x-4 text-xl">
            <a href="#" className="hover:text-blue-500 transition" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400 transition" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-600 transition" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-700 transition" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mt-10 text-center text-sm">
        <a href="#" className="hover:underline mx-2">Privacy Policy</a>
        <a href="#" className="hover:underline mx-2">Terms of Service</a>
      </div>

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed cursor-pointer bottom-6 right-6 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-800 transition shadow-lg"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

    </footer>
  );
};

export default Footer;
