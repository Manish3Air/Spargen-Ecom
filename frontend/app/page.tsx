"use client";
import React, { useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";

const sampleProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999.99,
    description: "Latest iPhone with A17 chip",
    stock: true,
    rating: 4.5,
    image: ["/Images/img1.png", "/Images/img2.png", "/Images/img3.png", "/Images/img3.png"],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 899.99,
    description: "Latest Samsung with Snapdragon 8 Gen 3",
    stock: false,
    rating: 4.7,
    image: ["/Images/img2.png", "/Images/img1.png", "/Images/img3.png", "/Images/img3.png"],
  },
  {
    id: "3",
    name: "iPad Air",
    price: 599.99,
    description: "Latest iPad with M2 chip",
    stock: true,
    rating: 4.6,
    image:["/Images/img3.png", "/Images/img2.png", "/Images/img1.png", "/Images/img3.png"],
  },
  {
    id: "4",
    name: "OnePlus 12",
    price: 749.99,
    description: "Latest OnePlus with Snapdragon 8 Gen 3",
    stock: true,
    rating: 4.4,
    image: ["/Images/img1.png", "/Images/img2.png", "/Images/img3.png", "/Images/img3.png"],
  },
];

export default function Home() {
  const { addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(sampleProducts));
  }, []);

  return (
    <main className="p-6 min-h-screen bg-[#e0e5ec]">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to MobileZone
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(item) => addToCart(item)}
          />
        ))}
      </div>
    </main>
  );
}
