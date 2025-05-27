"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import BASE_URL from "../../utils/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  // console.log("Cart Items:", cartItems);
  const router = useRouter();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone:"",
    city: "",
    zip: "",
  });

  type FormField = keyof typeof form;

  useEffect(() => {
    if (!currentUser) {
      toast.message("You must be logged in to access this page.");
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async () => {
  console.log("Inside handlePlaceOrder");

  // ✅ Ensure user is logged in
  if (!currentUser) {
    toast.warning("⚠️ You must be logged in to place an order.");
    router.push("/login");
    return;
  }

  // ✅ Validate form fields
  if (Object.values(form).some((val) => val.trim() === "")) {
    toast.warning("⚠️ Please fill all fields.");
    return;
  }

  const token = localStorage.getItem("authToken");

  // ✅ Construct the order object
  const order = {
    userEmail: currentUser.email,
    items: cartItems.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: Array.isArray(item.images) ? item.images[0] : item.images, // ✅ Defensive check
    })),
    total: totalPrice,
    actualTotal,
    shippingInfo: form,
  };

  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error("Failed to place order");

    const savedOrder = await res.json();

    // ✅ Save to localStorage for quick user access
    const existing = localStorage.getItem(`orders-${currentUser.email}`);
    const orderHistory = existing ? JSON.parse(existing) : [];
    orderHistory.push(savedOrder);
    localStorage.setItem(
      `orders-${currentUser.email}`,
      JSON.stringify(orderHistory)
    );
    localStorage.setItem("latestOrderId", savedOrder._id);

    clearCart(); // ✅ Clear cart after placing order
    
    router.push("/payment");

   
  } catch (err) {
    console.error("Error placing order:", err);
    toast.error("❌ Failed to place order.");
  }
};






const discountPercent = 20;
let discountedPrice = 0;
  const actualTotal = cartItems.reduce((total, item) => {
     // or item.discount if dynamic
    discountedPrice = item.price - item.price * (discountPercent / 100);
    return total + discountedPrice * item.quantity;
  }, 0);
  const discount = totalPrice - actualTotal;

  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">🧾 Checkout</h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Address Form */}
        <div className="bg-white dark:bg-gray-800 shadow-neumorphic dark:shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">🚚 Shipping Info</h2>
          {["name", "email", "phone", "address", "city", "zip"].map((field) => (
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
              <li
                key={item._id}
                className=" relative flex justify-between items-center gap-4"
              >
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1  rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>
                <Image
                  src={typeof item.images === "string"
                        ? item.images
                        : item.images[0] || "/placeholder.png"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p>
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    
                  <span className="line-through text-red-400">
                    ₹{item.price.toFixed(2)}
                  </span>{" "}
                  → ₹{discountedPrice.toFixed(2)} x {item.quantity} ={" "}
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    ₹{(discountedPrice * item.quantity).toFixed(2)}
                  </span>
                </p>
                </div>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-gray-300 dark:border-gray-600" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Original Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total after discount:</span>
              <span>₹{actualTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white transition rounded-md py-2 font-medium shadow-md"
          >
            ✅ Pay and  Place Order
          </button>
        </div>
      </div>
    </main>
  );
}
