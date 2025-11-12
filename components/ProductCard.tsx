"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";

// Star Rating Component
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-primary text-primary"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-text/60">({reviews})</span>
    </div>
  );
}

// Product Card Component
export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const discount =
    product.original_price && product.original_price > 0
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(product, 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group h-full flex flex-col bg-[#e9e6e275] rounded-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/35 border">
        {/* Image */}
        <div className="relative w-full h-96 md:h-74 bg-gray-100 overflow-hidden">
          <Image
            src={product.image_url || "/images/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          )}

          {/* Out of Stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-5 md:p-6 flex flex-col">
          {/* Title */}
          <h3 className="font-roboto-slab text-lg text-text mb-3 group-hover:text-primary transition-colors line-clamp-2 pb-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && product.reviews_count ? (
            <div className="pb-4">
              <StarRating
                rating={product.rating}
                reviews={product.reviews_count}
              />
            </div>
          ) : null}

          {/* Description */}
          <p className="text-sm text-text/70 line-clamp-2">
            {product.description || "No description available."}
          </p>

          {/* Spacer to push price to bottom */}
          <div className="flex-1"></div>

          {/* Price + Add to Cart - FIXED SECTION */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg text-text font-bold">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && product.original_price > 0 && (
                <span className="text-sm text-text/50 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/images/cart.png"
                alt="Add to cart"
                width={28}
                height={28}
                className="object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}