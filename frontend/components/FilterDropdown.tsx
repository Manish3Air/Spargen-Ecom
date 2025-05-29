import { FC, Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define props interface
interface FilterDropdownProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  categories: string[];
  selectedRating: number | null;
  setSelectedRating: Dispatch<SetStateAction<number | null>>;
  ratingOptions: number[];
  sortOrder: string;
  setSortOrder: Dispatch<SetStateAction<string>>;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedRating,
  setSelectedRating,
  ratingOptions,
  sortOrder,
  setSortOrder,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700 fixed top-24 right-4"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-1 w-62 space-y-2 p-4 rounded-xl shadow-lg bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-bold">Filters</h2>

            {/* Category */}
            <div>
              <label className="font-medium block mb-2">Category</label>
              <select
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="font-medium block mb-2">Rating</label>
              <select
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                value={selectedRating ?? ""}
                onChange={(e) =>
                  setSelectedRating(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">All</option>
                {ratingOptions.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate} & up
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="font-medium block mb-2">Sort by Price</label>
              <select
                className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Default</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
