"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";


interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [animate, setAnimate] = useState(false);

  const playPopSound = () => {
    const audio = new Audio("/Sounds/preview.mp3");
    audio.play();
  };

  const handleAddToCart = (product: Product) => {
    playPopSound();
    addToCart({ ...product, quantity: 1 });
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500); // Remove bounce after 0.5s
  };

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts([]);
      }
    }
  }, []);

  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-[#0a0a0a] text-gray-900 dark:text-white min-h-screen ">
      <h1 className="text-3xl font-extrabold  mb-8 text-center">
        🛍️ Explore Our Products
      </h1>

      {products.length === 0 ? (
        <p className=" text-center">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className=" rounded-2xl py-3 px-2 sm:px-5 md:px-4 lg:px-3 flex flex-col items-center bg-white dark:bg-gray-900  shadow-amber-500  transition hover:shadow-[2px_2px_4px_#c5c9d1,-2px_-2px_4px_#ffffff] hover:scale-[1.02]"
            >
              <Link href={`/products/${product.id}`} className="w-full">
                <div className="relative w-full h-[200px]">
                  <Image
                    src={
                      typeof product.image === "string"
                        ? product.image
                        : product.image[0] || "/placeholder.png"
                    }
                    alt={product.name}
                    fill
                    className="object-cover mb-3 mx-auto rounded-xl"
                  />
                  {isWishlisted(product.id) && (
                    <span className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 py-1 rounded-md shadow-md">
                      ❤️
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-center mt-2">
                  {product.name}
                </h2>
              </Link>

              <p className="font-medium text-md mt-1">
                ₹{product.price.toFixed(2)}
              </p>
              <p className="text-sm  text-center mt-1">{product.description}</p>

              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 rounded-xl font-semibold text-sm   hover:bg-white dark:hover:bg-black shadow-inner hover:shadow transition transform hover:scale-105"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() =>
                    isWishlisted(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="wishlist px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-br from-[#d1d9e6] to-[#f0f4f8] hover:from-[#c5cad4] hover:to-[#e7ebf2] transition transform hover:scale-105 text-red-500"
                >
                  {isWishlisted(product.id) ? "💔 Remove" : "💖 Wishlist"}
                  
                </button>
              </div>
            </div>
          ))}
          
        </div>

      )}

      {/* Sticky Cart Icon with dark mode, animation, quantity, and total price */}
      <Link
        href="/cart"
        onClick={() => setAnimate(false)} // reset animation if needed
        className={`fixed bottom-6 right-20 z-50 px-4 py-4 rounded-full shadow-[8px_8px_16px_#c5c9d1,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2a2a2a] bg-[#e0e5ec] dark:bg-[#1f1f1f] text-black dark:text-white hover:scale-105 transition-all flex items-center gap-2 ${
          animate ? "animate-bounce scale-110" : ""
        }`}
      >
        <span className="text-2xl">🛒</span>

        <div className="flex flex-col items-start">
          {cartItems.length > 0 && (
            <>
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
                items
              </span>
              <span className="text-xs font-semibold mt-0.5">
                $
                {cartItems
                  .reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                  )
                  .toFixed(2)}
              </span>
            </>
          )}
        </div>
      </Link>
      
    </main>
  );
}
