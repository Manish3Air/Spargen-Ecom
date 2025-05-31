"use client";
import BASE_URL from "../../utils/api";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
interface Product {
  _id: string;
  name: string;
  images: string | string[];
  price: number;
  description: string;
  // Add other product fields as needed
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { addToCart} = useCart();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

    const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
  };

useEffect(() => {
  if (!query) return;

  const fetchSearchResults = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/products/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Search results:", data);
      setResults(data);
    } catch (error: unknown) {
      console.error("❌ Frontend error:",error);
    } finally {
      setLoading(false);
    }
  };

  fetchSearchResults();
}, [query]);




  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h1>

      {loading ? (
  <p className="text-center text-gray-600 dark:text-gray-300 py-8">Loading products...</p>
) : !Array.isArray(results) || results.length === 0 ? (
  <p className="text-center text-gray-600 dark:text-gray-300 py-8">No products found.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 ">
    {results.map((product) => (
      <div
        key={product._id}
        className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 transition-transform hover:scale-105"
        tabIndex={0} // keyboard focusable
        role="group"
        aria-label={`Product: ${product.name}`}
      >
        <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={ Array.isArray(product.images) ? product.images?.[0] : '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain rounded-md"
            priority={true}
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white truncate" title={product.name}>
          {product.name}
        </h2>

        <p className="mt-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
          ₹{product.price?.toLocaleString()}
        </p>

        <button
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => handleAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>
)}


    </main>
  );
}
