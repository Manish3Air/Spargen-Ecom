"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Button } from "@/components/magicui/Button";
import Link from "next/link";
import { Phone, TabletSmartphone, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
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

const faqData = [
  {
    question: "How fast is delivery?",
    answer:
      "We offer fast shipping with most orders delivered within 2-5 business days. Express delivery options are also available for urgent orders.",
  },
  {
    question: "Do you offer returns?",
    answer:
      "Yes, we offer hassle-free returns within 30 days of purchase. Simply contact our support team, and we'll arrange a pickup.",
  },
  {
    question: "Is there a warranty?",
    answer:
      "All our products come with manufacturer warranties. Extended warranty options are also available for additional coverage.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets for your convenience.",
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Yes, we use industry-standard SSL encryption to protect your personal and payment information.",
  },
];

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string;
  description?: string;
}

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || data);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const imageList = Object.values(bannerImages);

  // Pagination calculation
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <main className="py-2 px-4 min-h-screen bg-[#f0f5ff] dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Hero Section with Heading */}
      <section className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
            Welcome to Mobile <AnimatedGradientText>Plaza</AnimatedGradientText>
          </h1>
          <div className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 flex justify-center items-center gap-2 flex-wrap">
            <span>Your one-stop shop for the latest </span>
            <WordRotate
              className="text-pink-400 font-bold"
              words={["Mobiles", "Tablets", "Devices"]}
            />
          </div>
        </motion.div>
      </section>

      {/* IMAGE CAROUSEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full rounded-xl shadow-lg mb-10"
      >
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
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[520px] bg-white dark:bg-gray-900 overflow-hidden rounded-xl">
                <Image
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Hero Section with CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-center py-12 px-4 sm:py-16 sm:px-6 md:px-12 lg:px-20 mb-10"
      >
        <Ripple />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight">
            Discover the Latest in Mobile & Tablet Technology
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 sm:mb-6 text-blue-50">
            Shop the latest smartphones, tablets, and accessories from top brands
            like Apple, Samsung, OnePlus, and more!
          </p>
          <Link href="/products">
            <Button className="rounded-xl text-base sm:text-lg px-6 py-2 sm:py-3 hover:shadow-lg transition-shadow">
              🛍️ Shop Now
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-2xl mb-10 bg-gray-100 dark:bg-gray-950"
      >
        <DotPattern />
        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-10">
          {[
            {
              icon: <Phone size={40} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />,
              title: "Latest Devices",
              description:
                "Stay ahead with our curated collection of the most advanced smartphones and tablets.",
            },
            {
              icon: <Rocket size={40} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />,
              title: "Fast Shipping",
              description:
                "We ensure quick and safe delivery to your doorstep, wherever you are.",
            },
            {
              icon: (
                <TabletSmartphone
                  size={40}
                  className="mx-auto mb-4 text-blue-600 dark:text-blue-400"
                />
              ),
              title: "Expert Support",
              description:
                "Need help? Our tech experts are just a click away to assist you anytime.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="my-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length}
              </p>
            </div>
            <Link href="/products">
              <Button className="rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                View All Products
              </Button>
            </Link>
          </div>

          {/* Mobile Horizontal Scroll Slider */}
          <div className="block lg:hidden overflow-x-auto scroll-smooth scrollbar-hide mb-6">
            <div className="flex gap-4 snap-x snap-mandatory">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="min-w-[85%] sm:min-w-[60%] snap-start flex-shrink-0"
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

          {/* Grid Layout for lg+ screens */}
          {loading ? (
            <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnimatePresence>
                  {paginatedProducts.map((product) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No products available at the moment.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Shop by Category */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ShopByCategory />
      </motion.div>

      {/* Customer Reviews Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="my-10 sm:my-16 bg-[#f0f5ff] dark:bg-gray-900 p-6 sm:p-10 rounded-2xl"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
          ⭐ What Our Customers Say
        </h2>
        <div className="relative bg-white dark:bg-gray-900 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl py-8">
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
        </div>
      </motion.section>

      {/* Top Brands Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="my-10 sm:my-16 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-2xl"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
          🏆 Top Brands
        </h2>
        <div className="flex justify-center gap-4 sm:gap-6 lg:gap-10 flex-wrap items-center">
          {[
            { name: "Apple", image: "/Images/appleicon.png" },
            { name: "Samsung", image: "/Images/samsunglogo.avif" },
            { name: "OnePlus", image: "/Images/Onepluslogo.png" },
            { name: "Xiaomi", image: "/Images/Xiaomilogo.png" },
          ].map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="w-24 sm:w-28 md:w-32 lg:w-36 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-blue-300 dark:border-blue-600 mb-2 mx-auto flex items-center justify-center bg-white dark:bg-gray-900">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={80}
                  height={80}
                  className="object-contain w-3/4 h-3/4"
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white text-center truncate w-full">
                {brand.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="my-10 sm:my-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {faqData.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ backgroundColor: expandedFAQ === i ? "rgba(59, 130, 246, 0.1)" : "transparent" }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold text-left text-sm sm:text-base">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: expandedFAQ === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="w-5 h-5 flex-shrink-0 ml-2" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 sm:p-10 mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-900 dark:to-blue-950 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">
          🚀 Join the Mobile Revolution
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-blue-50 mb-6 max-w-2xl mx-auto">
          Sign up now and get exclusive deals, early access, and tech news
          straight to your inbox.
        </p>
        <Link href="/register">
          <Button className="rounded-xl text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 hover:shadow-xl transition-shadow">
            ✨ Get Started
          </Button>
        </Link>
      </motion.section>
    </main>
  );
}
