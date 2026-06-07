"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Lens } from "@/components/magicui/lens";
import { jwtDecode } from "jwt-decode"; // You may need to run: npm install jwt-decode

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <motion.span
          key={`full-${i}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: i * 0.1,
          }}
        >
          ★
        </motion.span>
      ))}
      {halfStar && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: fullStars * 0.1,
          }}
        >
          ½
        </motion.span>
      )}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState("");
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Decode the token to get user info, including their ID
        const decoded: User = jwtDecode(token);
        setCurrentUser(decoded);
        setIsAuthenticated(true);
        setAuthToken(token);
      } catch (error) {
        console.error("Invalid token:", error);
        // Clear invalid token
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;

      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/products/${id}`),
          fetch(`${BASE_URL}/api/products/${id}/reviews`),
        ]);

        if (!productResponse.ok) throw new Error("Failed to fetch product");
        const productData = await productResponse.json();
        setProduct(productData.product || productData);

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || reviewsData);
        } else {
          console.warn("Could not fetch reviews.");
          setReviews([]);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        setProduct(null);
        setReviews([]);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to submit a review.");
      // You might want to redirect the user to the login page here.
      // e.g., router.push('/login');
      return;
    }
    if (newReviewRating === 0 || newReviewComment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }
    setIsSubmittingReview(true);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${BASE_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });

      // We expect a JSON response, so we parse it immediately.
      // If the response is not JSON (e.g., an HTML error page), this will throw a SyntaxError.
      const newReviewData = await response.json();

      if (!response.ok) {
        // If the server returned an error (e.g., 400, 500), but sent a JSON body,
        // we use the message from the JSON body.
        throw new Error(newReviewData.message || "Failed to submit review");
      }

      // If the response was successful, update the state.
      setReviews((prevReviews) => [newReviewData.review, ...prevReviews]);
      setNewReviewComment("");
      setNewReviewRating(0);
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      if (error instanceof SyntaxError) {
        // This catches cases where response.json() fails because the body is not valid JSON.
        alert(
          "Failed to submit review: The server returned an invalid response. This might be due to a server error.",
        );
      } else if (error instanceof Error) {
        alert(`Failed to submit review: ${error.message}`);
      } else {
        alert("An unknown error occurred while submitting your review.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditedRating(0);
    setEditedComment("");
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    setIsSubmittingReview(true); // Reuse submitting state for spinner

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/products/${id}/reviews/${editingReview._id}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({
            rating: editedRating,
            comment: editedComment,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      // Update the review in the local state
      setReviews(
        reviews.map((r) => (r._id === editingReview._id ? data.review : r)),
      );
      handleCancelEdit(); // Exit editing mode
    } catch (error: unknown) {
      console.error("Error updating review:", error);
      alert(
        `Failed to update review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) {
    return <p className="p-6 text-center">Loading product...</p>;
  }

  const images = Array.isArray(product.images)
    ? product.images
    : [product.images || "/placeholder.png"];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 md:p-4 lg:pd-2 bg-[#f0f5ff] dark:bg-gray-950 min-h-screen"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
          },
        }}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto bg-white dark:bg-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12"
      >
        {/* IMAGE CAROUSEL */}
        <motion.div
          variants={{
            hidden: { x: -50, opacity: 0 },
            visible: { x: 0, opacity: 1 },
          }}
          className="w-full h-[300px] sm:h-[350px] md:h-[500px] px-2 sm:px-4 sm:py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-inner"
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
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
        </motion.div>

        {/* PRODUCT INFO */}
        <motion.div
          variants={{
            hidden: { x: 50, opacity: 0 },
            visible: { x: 0, opacity: 1 },
          }}
          className="w-full flex flex-col justify-center gap-6"
        >
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h1 className="text-3xl sm:text-4xl mt-4 sm:mt-2 font-extrabold text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl sm:text-3xl text-green-600 dark:text-green-400 font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Stars rating={product.rating ?? 4.5} />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({(product.rating ?? 4.5).toFixed(1)})
              </span>
            </div>

            <div className="mt-4">
              <span
                className={`px-3 py-1 text-sm font-bold rounded-full ${
                  product.stock === false
                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                }`}
              >
                {product.stock === false ? "Out of Stock" : "In Stock"}
              </span>
            </div>

            <p className="mt-5 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {product.description ||
                "This is one of the latest models featuring cutting-edge performance, stunning design, and advanced features to elevate your tech experience."}
            </p>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Delivery & Offers
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  Free delivery by tomorrow if ordered within 5 hrs 30 mins
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> Cash on Delivery available
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> 10% instant discount on HDFC Bank Credit Cards
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> Buy 2 items, get 5% extra off on total bill
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon /> 7 days easy return policy
                </li>
              </ul>
            </div>
          </motion.div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              🛒 Add to Cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                isWishlisted(product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)
              }
              className="flex-1 bg-pink-100 text-pink-700 px-6 py-3 rounded-lg font-semibold border border-pink-300 hover:bg-pink-200 transition-all duration-200"
            >
              {isWishlisted(product._id)
                ? "💔 Remove from Wishlist"
                : "💖 Add to Wishlist"}
            </motion.button>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </motion.div>

        {/* REVIEWS SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-6 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-inner md:col-span-2"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Customer Reviews
          </h2>

          {isAuthenticated ? (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Write a review
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className={`text-3xl transition-transform transform hover:scale-110 ${
                        star <= newReviewRating
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about the product..."
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmittingReview}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </motion.button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 shadow-sm text-center">
              <p className="text-gray-700 dark:text-gray-300">
                You must be logged in to write a review.
              </p>
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
              >
                Log In or Sign Up
              </Link>
            </div>
          )}

          {reviews.length === 0 && (
            <p className="text-gray-600 dark:text-white">
              No reviews yet. Be the first to review!
            </p>
          )}

          <AnimatePresence initial={false}>
            <ul className="space-y-6">
              {reviews.map((review) =>
                editingReview?._id === review._id ? (
                  // EDITING VIEW
                  <motion.li
                    key={`editing-${review._id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-md"
                  >
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                      Edit your review
                    </h4>
                    <div className="mb-4">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setEditedRating(star)}
                            className={`text-3xl transition-transform transform hover:scale-110 ${
                              star <= editedRating
                                ? "text-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                            aria-label={`Rate ${star} stars`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      ></textarea>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateReview}
                        disabled={isSubmittingReview}
                        className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition disabled:bg-green-400"
                      >
                        {isSubmittingReview ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.li>
                ) : (
                  // DISPLAY VIEW
                  <motion.li
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                        {review.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {review.username}
                        </p>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                        {review.comment}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </p>
                        {currentUser?._id === review.userId && (
                          <button
                            onClick={() => handleEditClick(review)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ),
              )}
            </ul>
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </motion.main>
  );
}

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
