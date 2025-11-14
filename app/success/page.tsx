"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { createOrder } from "@/lib/api";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processOrder = async () => {
      // Prevent double processing
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("No session ID found. Please contact support.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔵 Creating order for session:", sessionId);
        
        // Create order in database
        const order = await createOrder(sessionId);
        
        console.log("Order created successfully:", order);
        setOrderId(order.id);
        
        // Clear cart after successful order
        clearCart();
        setLoading(false);
      } catch (err) {
        console.error("Failed to create order:", err);
        setError("Failed to save your order. Please contact support with your session ID.");
        setLoading(false);
      }
    };

    processOrder();
  }, [searchParams, clearCart]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <Loader2 className="w-20 h-20 text-primary animate-spin mx-auto pb-6" />
          <h2 className="font-roboto-slab text-2xl font-bold text-text pb-4">
            Processing Your Order...
          </h2>
          <p className="text-text/70">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto pb-6" />
          <h2 className="font-roboto-slab text-2xl font-bold text-text pb-4">
            Something Went Wrong
          </h2>
          <p className="text-text/70 pb-4">{error}</p>
          <p className="text-sm text-text/50 pb-8">
            Session ID: {searchParams.get("session_id")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto pb-6" />
        <h1 className="font-roboto-slab text-4xl font-bold text-text pb-4">
          Payment Successful!
        </h1>
        <p className="text-text/70 pb-2">
          Thank you for your order. You'll receive a confirmation email shortly.
        </p>
        {orderId && (
          <p className="text-sm text-text/50 pb-8">
            Order #{orderId}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
