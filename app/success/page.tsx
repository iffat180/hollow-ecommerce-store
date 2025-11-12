"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      hasCleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto pb-6" />
        <h1 className="font-roboto-slab text-4xl font-bold text-text pb-4">
          Payment Successful!
        </h1>
        <p className="text-text/70 pb-8">
          Thank you for your order. You'll receive a confirmation email shortly.
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