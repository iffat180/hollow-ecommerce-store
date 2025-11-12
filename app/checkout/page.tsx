"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/lib/api";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="container-padding">
          <div className="flex flex-col items-center text-center">
            <ShoppingBag className="w-24 h-24 text-text/30 pb-6" />
            <h1 className="font-roboto-slab text-4xl md:text-5xl font-bold text-text pb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-text/70 pb-8">
              Add some items to your cart before checking out.
            </p>
            <Button onClick={() => router.push("/shop")}>Start Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!customerName.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else if (customerName.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validate email
    if (!customerEmail.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  // Handle checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session
      const response = await createCheckoutSession({
        items: cart,
        customerEmail,
        customerName,
      });

      // Check if we got the URL
      if (!response.url) {
        throw new Error("No checkout URL received from server");
      }

      // Redirect to Stripe
      window.location.href = response.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 md:py-24 min-h-screen">
      <div className="container-padding">
        {/* Header */}
        <div className="pb-4">
          <h1 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text pb-2">
            Checkout
          </h1>
          <p className="text-text/70">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 md:p-8">
              <h2 className="font-roboto-slab text-2xl font-bold text-text pb-6">
                Customer Information
              </h2>

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text pb-2"
                  >
                    Full Name{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    aria-required="true"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-text transition-all ${
                      nameError
                        ? "border-red-500 focus:border-red-500"
                        : "border-text/20 focus:border-primary"
                    }`}
                    placeholder="John Doe"
                  />
                  {nameError && (
                    <p className="text-red-600 text-sm mt-1">{nameError}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text py-2"
                  >
                    Email Address{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    aria-required="true"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-text transition-all ${
                      emailError
                        ? "border-red-500 focus:border-red-500"
                        : "border-text/20 focus:border-primary"
                    }`}
                    placeholder="john@example.com"
                  />
                  {emailError && (
                    <p className="text-red-600 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <div className="pt-6 border-t border-text/10">
                  <h3 className="font-roboto-slab text-lg font-bold text-text pb-4">
                    Payment
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-text/70 pb-2">
                      You will be redirected to Stripe's secure payment page to
                      complete your purchase.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-text/60">
                      <span>🔒</span>
                      <span>Payments are secured by Stripe</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? "Processing..." : "Pay with Stripe"}
                    </Button>

                    <p className="text-xs text-text/50 text-center">
                      By clicking "Pay with Stripe", you agree to our terms and
                      conditions
                    </p>
                  </div>
                </div>

                {/* Back to Cart */}
                <button
                  type="button"
                  onClick={() => router.push("/cart")}
                  className="w-full text-center text-text/70 hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  aria-label="Go back to cart"
                >
                  ← Back to Cart
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <h2 className="font-roboto-slab text-2xl font-bold text-text pb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 pb-6 mb-6 border-b border-text/10">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-300 text-2xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="grow">
                      <h4 className="font-roboto-slab text-text font-medium text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-text/60">Qty: {item.quantity}</p>
                      <p className="text-sm text-primary font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 mb-6 border-b border-text/10">
                <div className="flex justify-between text-text/70">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text/70">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-text/70">
                  <span>Tax</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold text-text">Total</span>
                <span className="text-3xl font-bold text-primary">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-text/10 space-y-2 text-sm text-text/60">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure checkout powered by Stripe</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Free shipping on all orders</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>30-day money-back guarantee</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}