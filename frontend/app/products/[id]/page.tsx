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

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | string[];
  description?: string;
  rating?: number;
  stock?: boolean;
  reviews?: Review[];
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

// Helper to render stars
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

  // Image Zoom states
  // const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  // const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = parsed.find((p: Product) => p.id === id);
      setProduct(found || null);
    }
  }, [id]);

  if (!product) {
    return <p className="p-6 text-center">Product not found.</p>;
  }

  // Use dummy reviews or product reviews if available
  const reviews = product.reviews || dummyReviews;

  const images = Array.isArray(product.image) ? product.image : [product.image];

  // Handle zoom mouse movement
  // function handleMouseMove(e: React.MouseEvent) {
  //   if (!zoomRef.current) return;
  //   const rect = zoomRef.current.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //   zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  // }

  // Reset zoom when mouse leaves
  // function handleMouseLeave() {
  //   if (!zoomRef.current) return;
  //   zoomRef.current.style.backgroundPosition = "center";
  //   setZoomedImage(null);
  // }

  return (
    <main className="p-6 bg-[#e0e5ec] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow grid md:grid-cols-2 gap-8">
        {/* IMAGE CAROUSEL WITH ZOOM */}
        <div className="w-full">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            // autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            navigation={true}
            className="rounded-xl shadow-inner"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-[350px] flex justify-center items-center overflow-hidden rounded-xl cursor-zoom-in">
                  <Lens
                    zoomFactor={2}
                    lensSize={150}
                    isStatic={false}
                    ariaLabel="Zoom Area"
                  >
                    <Image
                      src={img}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-contain"
                      draggable={false}
                    />
                  </Lens>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* PRICE */}
            <p className="mt-2 text-2xl text-green-600 font-semibold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* RATING */}
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={product.rating ?? 4.5} />
              <span className="text-gray-600 text-sm">
                ({(product.rating ?? 4.5).toFixed(1)})
              </span>
            </div>

            {/* AVAILABILITY */}
            <div className="mt-2 text-green-600 text-sm font-medium">
              {product.stock === false ? "❌ Out of Stock" : "✅ In Stock"}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              {product.description ||
                "This is one of the latest models featuring cutting-edge performance, stunning design, and advanced features to elevate your tech experience."}
            </p>

            {/* DELIVERY INFO & OFFERS */}
            <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-gray-200 shadow-inner">
              <h3 className="font-semibold text-gray-800 mb-2">
                Delivery & Offers
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>
                  Free delivery by tomorrow if ordered within 5 hrs 30 mins
                </li>
                <li>Cash on Delivery available</li>
                <li>10% instant discount on HDFC Bank Credit Cards</li>
                <li>Buy 2 items, get 5% extra off on total bill</li>
                <li>7 days easy return policy</li>
              </ul>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() =>
                isWishlisted(product.id)
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className="bg-pink-100 text-pink-700 px-6 py-2 rounded-lg border border-pink-300 hover:bg-pink-200 transition"
            >
              {isWishlisted(product.id)
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

          {/* REVIEWS SECTION */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Customer Reviews
            </h2>

            {reviews.length === 0 && (
              <p className="text-gray-600">No reviews yet.</p>
            )}

            <ul className="space-y-6">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                      {review.username}
                    </p>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
