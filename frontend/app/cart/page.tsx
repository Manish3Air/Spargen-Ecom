"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const actualPrice = cartItems.reduce((total, item) => {
    const discountPercent = 20; // or item.discount if dynamic
    const discountedPrice = item.price - item.price * (discountPercent / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <main className="p-6 min-h-screen flex items-center justify-center bg-[#f0f5ff] dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          🛒 Your cart is empty.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-[#e0e5ec] dark:bg-[#0a0a0a] min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        🛍️ Your Cart
      </h1>

      <div className="max-w-5xl mx-auto space-y-8">
        {cartItems.map(({ id, name, price, quantity, image }) => {
          const discountPercent = 20; // Example: flat 20%
          const discountedPrice = price - price * (discountPercent / 100);

          return (
            <div
              key={id}
              className="relative flex flex-col sm:flex-row items-center gap-6 bg-[#f1f3f6] dark:bg-gray-900 shadow-neumorphic dark:shadow-neumorphic-dark rounded-2xl p-6 transition hover:shadow-lg"
            >
              {/* Discount badge */}
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>

              {/* Product Image */}
              <Image
                src={
                  typeof image === "string"
                    ? image
                    : image[0] || "/placeholder.png"
                }
                alt={name}
                width={128}
                height={128}
                className="w-24 h-24 object-contain rounded-xl bg-white dark:bg-gray-700 shadow-inner"
              />

              <div className="flex-1 w-full">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="line-through text-red-400">
                    ${price.toFixed(2)}
                  </span>{" "}
                  → ${discountedPrice.toFixed(2)} x {quantity} ={" "}
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    ${(discountedPrice * quantity).toFixed(2)}
                  </span>
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <label
                    htmlFor={`qty-${id}`}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Qty:
                  </label>
                  <input
                    id={`qty-${id}`}
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const val = +e.target.value;
                      if (val >= 1) updateQuantity(id, val);
                    }}
                    className="w-20 px-3 py-1.5 rounded-md shadow-inner bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-center text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => removeFromCart(id)}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          );
        })}

        <div className="text-right mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-neumorphic dark:shadow-neumorphic-dark">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Original:{" "}
            <span className="line-through">${totalPrice.toFixed(2)}</span>
          </h2>

          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
            Actual Price: ${actualPrice.toFixed(2)}
          </h4>

          <p className="text-green-600 dark:text-green-400 mt-1 font-semibold text-lg animate-bounce">
            ✅ You saved ${(totalPrice-actualPrice).toFixed(2)}!
          </p>

          <Link href="/checkout" passHref>
            <button className="mt-4 w-full bg-[#d1d9e6] dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition rounded-md py-2 font-medium text-gray-800 dark:text-white shadow-neumorphic-inner dark:shadow-none">
              Proceed to Checkout →
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
