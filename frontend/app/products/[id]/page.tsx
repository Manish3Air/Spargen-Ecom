"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Lens } from "@/components/magicui/lens";

import BASE_URL from "../../../utils/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string | string[];
  description?: string;
  rating?: number;
  stock?: boolean;
}

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const dummyReviews: Review[] = [
  {
    id: "r1",
    username: "Amit Kumar",
    rating: 5,
    comment: "Amazing product! Exceeded my expectations.",
    date: "2025-05-15",
  },
  {
    id: "r2",
    username: "Neha Singh",
    rating: 4,
    comment: "Good quality but delivery was a bit slow.",
    date: "2025-05-10",
  },
  {
    id: "r3",
    username: "Rajesh Patel",
    rating: 4,
    comment: "Value for money. Works perfectly.",
    date: "2025-05-12",
  },
];

function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="text-yellow-500">
      {"★".repeat(fullStars)}
      {halfStar ? "½" : ""}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.product || data); // depends on your controller shape
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      }
    };

    if (id) fetchProductById();
  }, [id]);

  if (!product) {
    return <p className="p-6 text-center">Loading product...</p>;
  }

  const images = Array.isArray(product.images)
    ? product.images
    : [product.images || "/placeholder.png"];

  const reviews = dummyReviews;

  return (
    <main className="p-4 sm:p-6 md:p-4 lg:pd-2 bg-[#f0f5ff] dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* IMAGE CAROUSEL */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[500px] px-2 sm:px-4 sm:py-2 bg-white dark:bg-gray-700 rounded-xl shadow-inner">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation={true}
            className="rounded-xl shadow-inner"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex justify-center items-center overflow-hidden rounded-xl cursor-zoom-in">
                  <Lens zoomFactor={2} lensSize={150} isStatic={false}>
                    <Image
                      src={img}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-cover max-h-[200px] sm:max-h-[300px] md:max-h-[450px]"
                      draggable={false}
                    />
                  </Lens>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* PRODUCT INFO */}
        <div className="w-full flex flex-col justify-start gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl mt-4 sm:mt-2 font-bold text-gray-800 dark:text-white">
              {product.name}
            </h1>
            <p className="mt-2 text-xl sm:text-2xl text-green-600 font-semibold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Stars rating={product.rating ?? 4.5} />
              <span className="text-gray-600 dark:text-white text-sm">
                ({(product.rating ?? 4.5).toFixed(1)})
              </span>
            </div>

            <div className="mt-2 text-green-600 text-sm font-medium">
              {product.stock === false ? "❌ Out of Stock" : "✅ In Stock"}
            </div>

            <p className="mt-4 text-gray-600 dark:text-white text-sm leading-relaxed">
              {product.description ||
                "This is one of the latest models featuring cutting-edge performance, stunning design, and advanced features to elevate your tech experience."}
            </p>

            <div className="mt-6 p-4 bg-[#f8fafc] dark:bg-gray-900 rounded-lg border border-gray-200 shadow-inner">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Delivery & Offers
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 text-sm space-y-1">
                <li>Free delivery by tomorrow if ordered within 5 hrs 30 mins</li>
                <li>Cash on Delivery available</li>
                <li>10% instant discount on HDFC Bank Credit Cards</li>
                <li>Buy 2 items, get 5% extra off on total bill</li>
                <li>7 days easy return policy</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() =>
                isWishlisted(product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)
              }
              className="bg-pink-100 text-pink-700 px-6 py-2 rounded-lg border border-pink-300 hover:bg-pink-200 transition"
            >
              {isWishlisted(product._id)
                ? "💔 Remove from Wishlist"
                : "💖 Add to Wishlist"}
            </button>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* REVIEWS SECTION */}
        <section className="p-4 sm:p-6 w-full bg-white dark:bg-gray-900 rounded-xl shadow-inner md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Customer Reviews
          </h2>

          {reviews.length === 0 && (
            <p className="text-gray-600 dark:text-white">No reviews yet.</p>
          )}

          <ul className="space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {review.username}
                  </p>
                  <Stars rating={review.rating} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  {review.comment}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
