"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "description" | "shipping" | "specifications"
  >("description");

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductBySlug(slug as string);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-text/60">Loading product details...</p>
      </main>
    );

  if (error || !product)
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-roboto-slab font-bold text-text mb-4">
          Product Not Found
        </h1>
        <p className="text-text/70 mb-8">
          The product you’re looking for doesn’t exist or has been removed.
        </p>
        <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
      </main>
    );

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : 0;

  return (
    <main className="pb-16 pt-4 md:pb-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm pb-3 text-text/70">
          <button onClick={() => router.push("/")} className="hover:text-primary">
            Home
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={() => router.push("/shop")}
            className="hover:text-primary"
          >
            Shop
          </button>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16">
          {/* Left: Image */}
          <div className="relative h-96 md:h-[500px] bg-white rounded-lg overflow-hidden border border-text/10 shadow-lg">
            <Image
              src={product.image_url || "/images/placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{discount}%
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <h1 className="font-roboto-slab text-3xl md:text-4xl font-bold text-text pb-3">
              {product.name}
            </h1>

            {product.rating && product.reviews_count ? (
              <div className="flex items-center gap-2 pb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-text/60">
                  ({product.reviews_count} reviews)
                </span>
              </div>
            ) : null}

            <div className="flex items-baseline gap-3 pb-6">
              <span className="text-3xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-text/50 line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-primary font-semibold">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="text-text/80 leading-relaxed pb-6">
              {product.description || "No description available."}
            </p>

            <div className="flex items-center gap-4 pb-8">
              <div className="flex items-center border-2 border-text/30 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-text/10"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r border-text/30">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-text/10"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="min-w-[180px]"
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : isAdding
                  ? "Adding..."
                  : "Add to Cart"}
              </Button>
            </div>

            {product.stock !== undefined && (
              <p className="text-sm text-text/60 pb-2">
                Stock:{" "}
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-text/10 pt-6">
          <div className="flex gap-8 border-b border-text/10 pb-4">
            {["description", "shipping", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-2 font-semibold capitalize ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-text/60 hover:text-text"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-text leading-relaxed pt-4">
            {activeTab === "description" && (
              <>
                <h3 className="font-roboto-slab text-2xl font-bold pb-3">
                  Product Description
                </h3>
                <p>
                  {product.description ||
                    "This safety equipment is crafted to provide maximum protection and built with durable, ANSI/OSHA-compliant materials."}
                </p>
              </>
            )}

            {activeTab === "shipping" && (
              <>
                <h3 className="font-roboto-slab text-2xl font-bold pb-3">
                  Shipping Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Free shipping on all orders</li>
                  <li>Standard delivery: 5–7 business days</li>
                  <li>Express delivery: 2–3 business days</li>
                  <li>30-day easy returns</li>
                </ul>
              </>
            )}

            {activeTab === "specifications" && (
              <>
                <h3 className="font-roboto-slab text-2xl font-bold pb-3">
                  Specifications
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>ANSI/OSHA certified</li>
                  <li>Durable and ergonomic</li>
                  <li>Comfortable fit for long hours</li>
                  <li>Easy cleaning and maintenance</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
