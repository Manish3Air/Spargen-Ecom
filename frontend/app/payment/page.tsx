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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4">
  <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
    Hold on, your payment is getting processed
  </h2>
  <div className="flex space-x-2 text-4xl font-extrabold">
    {/* Animated dots */}
    <span className="animate-pulse">●</span>
    <span className="animate-pulse animation-delay-200">●</span>
    <span className="animate-pulse animation-delay-400">●</span>
  </div>
</div>

  );
}
