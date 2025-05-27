"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Button } from "@/components/magicui/Button";
import Link from "next/link";
import { Phone, TabletSmartphone, Rocket } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import BASE_URL from "../utils/api";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Ripple } from "@/components/magicui/ripple";

import { DotPattern } from "@/components/magicui/dot-pattern";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "/Images/img1.png",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/Images/img1.png",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/Images/img1.png",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/Images/img1.png",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/Images/img1.png",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/Images/img1.png",
  },
];

const bannerImages = {
  banner1: "/Images/banner7.jpg",
  banner2: "/Images/banner2.jpg",
  banner3: "/Images/banner3.jpg",
  banner4: "/Images/banner4.webp",
  banner5: "/Images/banner5.jpg",
  banner6: "/Images/banner6.webp",
};

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string;
  description?: string;
}

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  const ReviewCard = ({
    img,
    name,
    username,
    body,
  }: {
    img: string;
    name: string;
    username: string;
    body: string;
  }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            className="rounded-full"
            width="32"
            height="32"
            alt=""
            src={img}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">{body}</blockquote>
      </figure>
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`); // ✅ change to your actual endpoint
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || data); // depending on your API response shape
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Replace with your banner image URL
  // const product = sampleProducts[0]; // Example product
  // const images = Array.isArray(product.image) ? product.image : [product.image];
  const imageList = Object.values(bannerImages);

  return (
    <main className="py-2 px-4 min-h-screen bg-[#f0f5ff] dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold mb-2">
          Welcome to Mobile <AnimatedGradientText>Plaza</AnimatedGradientText>
        </h1>
        <div className="text-lg text-gray-700 dark:text-gray-300 flex justify-center items-center gap-2">
          <span>Your one-stop shop for the latest </span>
          <WordRotate
            className="text-pink-400"
            words={["Mobiles", "Tablets"]}
          />
        </div>
      </div>
      

      {/* IMAGE CAROUSEL WITH ZOOM */}
      <div className="w-full rounded-xl shadow-lg">
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
          {imageList.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-[520px] bg-white dark:bg-gray-900 overflow-hidden rounded-xl">
                <Image
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  fill
                  className="object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden rounded-xl mt-10 bg-gray-900 py-20 text-center">
        <Ripple />
        <h1 className="text-5xl font-bold mb-4 text-white">
          Discover the Latest in Mobile & Tablet Technology
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-white">
          Shop the latest smartphones, tablets, and accessories from top brands
          like Apple, Samsung, OnePlus, and more!
        </p>
        <Link href="/products">
          <Button className="rounded-xl text-lg">Shop Now</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="relative rounded h-[300px] w-full overflow-hidden mt-10">
        <DotPattern />
        <div className="absolute grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-6 py-10">
          {[
            {
              icon: <Phone size={40} className="mx-auto mb-4 text-primary" />,
              title: "Latest Devices",
              description:
                "Stay ahead with our curated collection of the most advanced smartphones and tablets.",
            },
            {
              icon: <Rocket size={40} className="mx-auto mb-4 text-primary" />,
              title: "Fast Shipping",
              description:
                "We ensure quick and safe delivery to your doorstep, wherever you are.",
            },
            {
              icon: (
                <TabletSmartphone
                  size={40}
                  className="mx-auto mb-4 text-primary"
                />
              ),
              title: "Expert Support",
              description:
                "Need help? Our tech experts are just a click away to assist you anytime.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-10">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={(product) => addToCart({ ...product, quantity: 1 })}
            />
          ))}
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Smartphones", image: "/Images/img1.png" },
            { name: "Tablets", image: "/Images/img2.png" },
            { name: "Accessories", image: "/Images/img3.png" },
            { name: "Smartwatches", image: "/Images/img1.png" },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-center hover:shadow-white dark:hover:shadow-gray-700 transition-transform"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 hover:scale-105 transition-transform">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="my-16 bg-[#f0f5ff] dark:bg-gray-900 p-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Customers Say
        </h2>
        <div className="relative bg-white dark:bg-gray-900 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </section>

      <section className="my-16 bg-white dark:bg-gray-900 p-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Top Brands</h2>
        <div className="flex justify-center gap-10 flex-wrap items-center">
          {["apple", "samsung", "oneplus", "xiaomi"].map((brand, i) => (
            <div
              key={i}
              className="h-8 w-24 text-center bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            "How fast is delivery?",
            "Do you offer returns?",
            "Is there a warranty?",
          ].map((q, i) => (
            <details
              key={i}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow"
            >
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Answer coming soon.
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4">Join the Mobile Revolution</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Sign up now and get exclusive deals, early access, and tech news
          straight to your inbox.
        </p>
        <Link href="/register">
          <Button className="rounded-xl text-lg">Get Started</Button>
        </Link>
      </section>
    </main>
  );
}
