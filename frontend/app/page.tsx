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
import ShopByCategory from "@/components/ShopByCategory";
import { motion, AnimatePresence } from "framer-motion";

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
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  const [visibleCount, setVisibleCount] = useState(8);

  const showMore = () => {
    setVisibleCount((prev) => prev + 4); // show 4 more each time
  };

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
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || data);
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
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden rounded-xl mt-10 bg-gray-900 text-center py-16 px-4 sm:py-20 sm:px-6 md:px-12 lg:px-20">
        <Ripple />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Discover the Latest in Mobile & Tablet Technology
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 text-white">
          Shop the latest smartphones, tablets, and accessories from top brands
          like Apple, Samsung, OnePlus, and more!
        </p>
        <Link href="/products">
          <Button className="rounded-xl text-base sm:text-lg px-6 py-3">
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="relative w-full overflow-hidden rounded-xl mt-10 h-auto bg-gray-100 dark:bg-gray-950">
        <DotPattern />

        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 py-10 text-center ">
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

      {/* Featured Products */}

      <section className="my-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products">
            <button className="text-sm sm:text-base px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700">
              View All Products
            </button>
          </Link>
        </div>

        {/* Mobile Horizontal Scroll Slider */}
        <div className="block md:hidden overflow-x-auto scroll-smooth scrollbar-hide">
          <div className="flex gap-4 snap-x snap-mandatory">
            {products.map((product) => (
              <div
                key={product._id}
                className="min-w-[80%] snap-start flex-shrink-0"
              >
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  cartItems={cartItems}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Grid Layout for md+ screens */}
        <>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.slice(0, visibleCount).map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    cartItems={cartItems}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {visibleCount < products.length ? (
            <div className="flex justify-center mt-6">
              <button
                onClick={showMore}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                View More
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              🚫 No more products available at the moment.
            </p>
          )}
        </>
      </section>

      <ShopByCategory />

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
          {[
            { name: "Apple", image: "/Images/appleicon.png" },
            { name: "Samsung", image: "/Images/samsunglogo.avif" },
            { name: "Oneplus", image: "/Images/Onepluslogo.png" },
            { name: "Xiaomi", image: "/Images/Xiaomilogo.png" },
          ].map((brand, i) => (
            <div
              key={i}
              className="w-28 sm:w-32 md:w-36 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-blue-300 dark:border-blue-600 mb-2">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-white text-center truncate w-full">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-10">
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

      <section className="p-6 mb-6 text-center bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
