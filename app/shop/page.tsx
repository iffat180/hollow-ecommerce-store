"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard"; // imported reusable component

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FILTERS COMMENTED OUT (backend logic not implemented yet) ---
  /*
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange({});
    setMinRating(undefined);
    setSearchInput('');
    setSearchQuery('');
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (priceRange.min !== undefined && product.price < priceRange.min) return false;
    if (priceRange.max !== undefined && product.price > priceRange.max) return false;
    if (minRating !== undefined && product.rating < minRating) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (priceRange.min !== undefined || priceRange.max !== undefined ? 1 : 0) +
    (minRating !== undefined ? 1 : 0) +
    (searchQuery ? 1 : 0);
  */

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setError(null);
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
    <div className="py-16 md:py-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="pb-8">
          <h1 className="font-roboto-slab text-5xl font-bold text-text pb-4">
            Shop All Products
          </h1>
          <p className="text-lg text-text/80">
            Browse our complete collection of safety equipment
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-text/60">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center mb-8">
            <p className="text-red-600 font-roboto mb-4">{error}</p>
            <p className="text-sm text-red-500 font-roboto">
              Make sure your backend is running on http://localhost:5050
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div>
            {/* Results Info */}
            <div className="pb-6 flex items-center justify-between">
              <p className="text-text/60">Showing {products.length} products</p>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-text/60 text-lg mb-4">
                  No products available
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
