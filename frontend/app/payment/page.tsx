"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "../../utils/api";
import { toast } from "sonner";
export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    const simulatePayment = async () => {
      const orderId = localStorage.getItem("latestOrderId");

      if (!orderId) {
        toast.error("No order found to pay for.");
        router.push("/checkout");
        return;
      }
      const token = localStorage.getItem("authToken");
      setTimeout(async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/orders/${orderId}/pay`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await res.json();

          if (result.success) {
            localStorage.removeItem("cart");
            localStorage.removeItem("latestOrderId");
            router.push(`/order-success?orderId=${orderId}`);
          } else {
            toast.error("Payment failed");
            router.push("/checkout");
          }
        } catch (error) {
          console.error("Payment simulation error:", error);
        }
      }, 3000);
    };

    simulatePayment();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4 sm:px-6 py-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 drop-shadow-lg">
        Hold on, your payment is getting processed
      </h2>

      <div className="flex space-x-2 text-3xl sm:text-4xl font-extrabold">
        <span className="animate-pulse">●</span>
        <span className="animate-pulse delay-200">●</span>
        <span className="animate-pulse delay-400">●</span>
      </div>

      <style jsx>{`
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
