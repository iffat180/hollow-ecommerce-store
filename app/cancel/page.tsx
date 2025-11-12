"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <XCircle className="w-20 h-20 text-orange-500 mx-auto pb-6" />
        <h1 className="font-roboto-slab text-4xl font-bold text-text pb-4">
          Payment Cancelled
        </h1>
        <p className="text-text/70 pb-8">
          Your payment was cancelled. No charges were made. Your cart items are
          still saved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/cart")}>Return to Cart</Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}