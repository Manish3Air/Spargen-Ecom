"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { TextAnimate } from "@/components/magicui/text-animate";
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
      <div>
        <TextAnimate
          animation="slideLeft"
          by="word"
          className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white"
        >
          🛍️ Your Cart
        </TextAnimate>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {Array.isArray(cartItems) &&
          cartItems.map(({ _id, name, price, quantity, images }) => {
            const discountPercent = 20; // Example: flat 20%
            const discountedPrice = price - price * (discountPercent / 100);

            return (
              <div
                key={_id}
                className="relative flex flex-col sm:flex-row items-center gap-6 bg-[#f1f3f6] dark:bg-gray-900 shadow-neumorphic dark:shadow-neumorphic-dark rounded-2xl p-6 transition hover:shadow-lg"
              >
                {/* Discount badge */}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>

                {/* Product Image */}
                <Image
                  src={
                    typeof images === "string"
                      ? images
                      : Array.isArray(images) && images.length > 0
                      ? images[0]
                      : "/Images/img1.png"
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
                      ₹{price.toFixed(2)}
                    </span>{" "}
                    → ₹{discountedPrice.toFixed(2)} x {quantity} ={" "}
                    <span className="text-gray-800 dark:text-gray-100 font-medium">
                      ₹{(discountedPrice * quantity).toFixed(2)}
                    </span>
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <label
                      htmlFor={`qty-${_id}`}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Qty:
                    </label>

                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-md shadow-inner overflow-hidden bg-white dark:bg-gray-700">
                      <button
                        onClick={() =>
                          updateQuantity(_id, Math.max(1, quantity - 1))
                        }
                        className="px-3 py-1 text-gray-800 dark:text-white text-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        −
                      </button>

                      <input
                        id={`qty-${_id}`}
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          const val = +e.target.value;
                          if (val >= 1) updateQuantity(_id, val);
                        }}
                        className="w-16 text-center p-1 sm:px-2 sm:py-1.5 bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none"
                      />

                      <button
                        onClick={() => updateQuantity(_id, quantity + 1)}
                        className="px-3 py-1 text-gray-800 dark:text-white text-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => removeFromCart(_id)}
                        className="text-xs sm:text-sm font-medium bg-red-500 p-1 sm:p-3 text-white hover:underline rounded "
                      >
                        Remove from cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="text-right mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-neumorphic dark:shadow-neumorphic-dark">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Original:{" "}
            <span className="line-through">₹{totalPrice.toFixed(2)}</span>
          </h2>

          <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Actual Price: ₹{actualPrice.toFixed(2)}
          </h4>

          <p className="text-green-600 dark:text-green-400 mt-1 font-semibold text-lg animate-bounce">
            ✅ You saved ₹{(totalPrice - actualPrice).toFixed(2)}!
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
