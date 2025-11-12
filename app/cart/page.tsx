"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.success("Cart cleared");
    }
  };

  // Empty cart state
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
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => router.push("/shop")}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 min-h-screen">
      <div className="container-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <h1 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text pb-2">
              Shopping Cart
            </h1>
            <p className="text-text/70">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-sm text-text/60 hover:text-primary transition-colors font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 flex flex-col gap-1.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 flex gap-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-roboto-slab text-lg font-bold text-text hover:text-primary transition-colors pb-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-text/60 pb-3">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full border-2 border-text/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-12 text-center font-semibold text-text">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border-2 border-text/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="text-right flex flex-col justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-text/50">Subtotal</p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="text-text/60 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <h2 className="font-roboto-slab text-2xl font-bold text-text pb-6">
                Order Summary
              </h2>

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

              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold text-text">Total</span>
                <span className="text-3xl font-bold text-primary">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3 pb-6 flex flex-col gap-2.5">
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/shop")}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-text/10 space-y-2 text-sm text-text/60">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure checkout</span>
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