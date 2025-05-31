"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VoiceSearch from "../shared/VoiceSearch";
import { Mic } from "lucide-react";
import clsx from "clsx";

const animatedPlaceholders = [
  "iphone 16 pro",
  "iphone 16",
  "vivo X90",
  "samsung galaxy S23",
  "samsung galaxy S23 ultra",
  "realme 11 pro",
  "realme 11 X 5g",
  "redmi note 12",
  "redmi 13 Pro",
  "onePlus 11",
  "onePlus nord 3",
  "nothing phone 2a",
  "nothing phone 1",
  "Google pixel 7",
  "Google pixel 7S",
  "motorola edge 40",
  "motorola edge 40 neo",
  "apple watch",
  "smart watches",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  // For animated placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    animatedPlaceholders[0]
  );

  useEffect(() => {
    if (focused || query) return;

    const interval = setInterval(() => {
      setAnimating(true);

      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % animatedPlaceholders.length);
        setAnimating(false);
      },500); // animation duration
    }, 2500); // interval duration

    return () => clearInterval(interval);
  }, [focused, query]);

  useEffect(() => {
    setCurrentPlaceholder(animatedPlaceholders[placeholderIndex]);
  }, [placeholderIndex]);

  const handleSearch = (text: string) => {
    const q = text.trim();
    if (q) router.push(`/search?query=${q}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center bg-white dark:bg-gray-900 rounded-full px-1 sm:px-4 py-2 border-[#e5e1e1] shadow-md dark:shadow-inner-dark transition-all duration-300 border-2">
      <input
        type="text"
        value={query}
        // We keep input placeholder minimal or empty so animated placeholder shows nicely
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
        className={clsx(
          "flex-grow  px-1 sm:px-3 py-2 bg-transparent text-black dark:text-gray-100 text-sm outline-none",
          "placeholder-transparent",
          "relative z-10"
        )}
      />

      {/* Animated placeholder overlay */}
      {!focused && !query && (
        <div
          aria-hidden="true"
          className="absolute text-centre left-10 pointer-events-none text-gray-400 dark:text-gray-400 text-sm font-semibold overflow-hidden h-6 top-4 "
        >
          <div
            className={`transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] 
            ${animating ? "-translate-y-4 opacity-0" : ""} 
            text-gray-600 dark:text-gray-300 text-[15px] font-medium font-['Roboto','sans-serif'] tracking-wide`}
          >
            {`${currentPlaceholder}`}
          </div>
        </div>
      )}

      <div className="flex items-center  sm:ml-0 space-x-1 sm:space-x-2  relative z-10">
        <button
          type="button"
          onClick={() => handleSearch(query)}
          className="text-sm px-1 sm:px-4 sm:py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition"
        >
          Search
        </button>

        <div className="text-gray-900 dark:text-white hover:text-blue-500 cursor-pointer transition">
          <VoiceSearch
            onSearch={(text) => {
              setQuery(text);
              handleSearch(text);
            }}
          >
            <Mic className="w-5 h-5 " />
          </VoiceSearch>
        </div>
      </div>
    </div>
  );
}
