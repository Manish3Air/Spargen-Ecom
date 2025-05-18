"use client";
import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface Props {
  product: Product;
  onAddToCart: (item: CartItem) => void;
}

const ProductCard = ({ product, onAddToCart }: Props) => {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="bg-[#e0e5ec] shadow-neumorphic hover:shadow-lg transition-shadow rounded-2xl py-8 w-full flex flex-col items-center text-center">
      <div className="relative w-full px-5">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-[200px] cursor-pointer">
            <Image
              src={typeof product.image === "string" ? product.image : product.image[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain rounded bg-white shadow-inner"
            />
          </div>
        </Link>

        {wishlisted && (
          <span className="absolute top-2 right-7 text-xs bg-red-500 text-white px-2 py-1 rounded-md shadow-md">
            ❤️
          </span>
        )}
      </div>

      <Link href={`/products/${product.id}`}>
        <h3 className="text-lg font-semibold text-gray-800 truncate w-full cursor-pointer">
          {product.name}
        </h3>
      </Link>

      <p className="text-gray-600 mb-3 text-sm">${product.price.toFixed(2)}</p>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() =>
            onAddToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image,
            })
          }
          className="bg-gradient-to-br from-[#d1d9e6] to-[#f0f4f8] shadow-neumorphic-inner hover:shadow-inner hover:scale-105 transition rounded-lg px-4 py-2 font-medium text-sm text-black"
        >
          🛒 Add to Cart
        </button>

        <button
          onClick={() =>
            wishlisted
              ? removeFromWishlist(product.id)
              : addToWishlist({ ...product })
          }
          className="bg-gradient-to-br from-[#d1d9e6] to-[#f0f4f8] rounded-lg px-4 py-2 text-center hover:scale-105 transition font-medium text-sm text-red-600"
        >
          {wishlisted ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
