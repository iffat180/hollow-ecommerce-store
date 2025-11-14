"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./ui/Button";
import { getAllProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-16 md:py-20">
      {/* Header */}
      <div className="mb-12 md:mb-16 text-center md:text-left">
        <p className="text-sm uppercase tracking-widest text-text/60 font-semibold pb-4">
          Our Shop
        </p>
        <h2 className="font-family-serif text-3xl md:text-4xl leading-tight pb-6 md:pb-6 font-bold">
          Featured Safety
          <br />
          Equipments
        </h2>
        <p className="text-text/80 pb-6">
          Our top-rated safety products trusted by professionals worldwide.
          <br className="hidden md:block" />
          Premium quality with industry certifications.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text/60">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
          <p className="text-red-600 font-roboto mb-4">{error}</p>
          <p className="text-sm text-red-500 font-roboto">
            Failed to load products. Please try refreshing the page or come back later.
          </p>
        </div>
      )}

      {/* Products */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-sm:px-16 mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center pt-10">
            <Link href="/shop">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl font-roboto text-text">
            No products available at the moment.
          </p>
        </div>
      )}
    </section>
  );
}
