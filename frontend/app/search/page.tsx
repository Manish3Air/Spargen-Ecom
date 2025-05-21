"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  // Add other product fields as needed
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    // Replace with your real API route
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("Search error:", err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <div key={product.id} className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <Image src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-md" />
              <h2 className="text-lg font-bold mt-2">{product.name}</h2>
              <p className="text-blue-600 font-semibold">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
