"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function OrderSuccess() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update confetti size on mount and resize
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 px-4 sm:px-6 py-10">
      {/* Confetti animation */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.3}
      />

      {/* Animated checkmark */}
      <div className="mb-6">
        <svg
          className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 stroke-current mx-auto"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-green-400"
            cx="26"
            cy="26"
            r="25"
            strokeWidth="2"
            strokeDasharray="157"
            strokeDashoffset="157"
            style={{ animation: "dashCircle 1s forwards" }}
          />
          <path
            className="stroke-green-600"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l7 7 17-17"
            strokeDasharray="48"
            strokeDashoffset="48"
            style={{ animation: "dashCheck 0.5s 1s forwards" }}
          />
        </svg>
      </div>

      {/* Text Section */}
      <div className="text-center max-w-lg space-y-3 px-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-700 dark:text-green-300 drop-shadow-md">
          🎉 Payment Successful!
        </h1>

        <p className="text-base sm:text-lg text-green-900 dark:text-green-100">
          Your order has been placed and paid successfully.
        </p>

        <p className="text-sm sm:text-base text-green-700 dark:text-green-200 font-mono break-words">
          Order ID: <span>{orderId || "N/A"}</span>
        </p>
      </div>

      {/* Button */}
      <div className="mt-6">
        <Link href="/orders">
          <button className="px-5 py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            View Order
          </button>
        </Link>
      </div>

      {/* Keyframe Styles */}
      <style jsx>{`
        @keyframes dashCircle {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dashCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
