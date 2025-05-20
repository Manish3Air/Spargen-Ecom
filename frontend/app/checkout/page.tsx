"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });


  type FormField = keyof typeof form;

  useEffect(() => {
    if (!currentUser) {
      alert("You must be logged in to access this page.");
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (Object.values(form).some((val) => val.trim() === "")) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    const order = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: cartItems,
      total: totalPrice,
      shipping: form,
    };

    if (currentUser) {
      const existing = localStorage.getItem(`orders-${currentUser.email}`);
      const orderHistory = existing ? JSON.parse(existing) : [];
      orderHistory.push(order);
      localStorage.setItem(
        `orders-${currentUser.email}`,
        JSON.stringify(orderHistory)
      );
    }

    setTimeout(() => {
      clearCart();
      alert("✅ Order placed successfully!");
      router.push("/");
    }, 1000);
  };

  const actualTotal = cartItems.reduce((total, item) => {
    const discountPercent = 20; // or item.discount if dynamic
    const discountedPrice = item.price - item.price * (discountPercent / 100);
    return total + discountedPrice * item.quantity;
  }, 0);
  const discount = totalPrice - actualTotal;

  return (
    <main className="p-6 bg-[#e0e5ec] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">🧾 Checkout</h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Address Form */}
        <div className="bg-white dark:bg-gray-800 shadow-neumorphic dark:shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">🚚 Shipping Info</h2>
          {["name", "email", "address", "city", "zip"].map((field) => (
            <input
              key={field}
              name={field}
              type="text"
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={form[field as FormField]}
              onChange={handleChange}
              className="w-full p-3 rounded-md shadow-inner bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none"
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 shadow-neumorphic dark:shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">🛒 Order Summary</h2>

          <ul className="space-y-3 text-sm">
            {cartItems.length === 0 && (
              <li className="text-gray-500">Your cart is empty.</li>
            )}

            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <div>
                  <p>
                    {item.name} × {item.quantity}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ₹{item.price} → ₹{actualTotal.toFixed(2)}
                  </span>
                </div>
                <span className="font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-gray-300 dark:border-gray-600" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Actual Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{actualTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white transition rounded-md py-2 font-medium shadow-md"
          >
            ✅ Place Order
          </button>
        </div>
      </div>
    </main>
  );
}
