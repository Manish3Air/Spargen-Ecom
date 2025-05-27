"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { Pointer } from "@/components/magicui/pointer";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="p-4 min-h-screen bg-[#f0f5ff] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors">
      <div>
          <TextAnimate animation="blurInUp" by="character" className="text-3xl font-bold mb-10 text-center text-pink-500 dark:text-pink-400">
          💖 Your WishList
          </TextAnimate>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex items-center justify-center h-64  text-lg">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full mx-auto">
          {wishlist.map(({ _id, name, price, images }) => (
            <div
              key={_id}
              className=" border-2 bg-white dark:bg-gray-900 border-[#cdd5df] dark:border-[#3a3a3a] rounded-2xl py-3 px-2 sm:px-5 md:px-4 lg:px-3 flex flex-col items-center text-center transition-all shadow-amber-500 hover:shadow-[2px_2px_4px_#c5c9d1,-2px_-2px_4px_#ffffff] hover:scale-[1.02]"
            >
              <div className="relative w-full h-[200px]">
                <Image
                  src={
                    typeof images === "string"
                      ? images
                      : images[0] || "/placeholder.png"
                  }
                  alt={name}
                  fill
                  className="w-36 h-36 object-cover mb-4 rounded-xl  shadow-inner"
                />
              </div>
              <h2 className="text-lg font-semibold  truncate w-full">{name}</h2>

              <p className="text-sm  mb-4">${price.toFixed(2)}</p>

              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  onClick={() =>
                    addToCart({ _id, name, price, images, quantity: 1 })
                  }
                  className="px-4 py-2 rounded-xl font-semibold text-sm   hover:bg-white dark:hover:bg-black shadow-inner hover:shadow transition transform hover:scale-105"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(_id)}
                  className="text-sm font-semibold py-1 px-2 rounded-xl bg-red-500 text-white hover:bg-red-700 hover:scale-105  transition"
                >
                  ❌Remove from Wishlist
                </button>
              </div>

              {/* Optional: Decorative floating heart */}
              <span className="absolute top-3 right-3 text-xl animate-pulse">
                💖
              </span>
            </div>
          ))}
        </div>
      )}
      <Pointer>
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-pink-600"
          >
            <motion.path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </Pointer>
    </main>
  );
}
