import { getAllProducts } from "@/lib/services/products.service";
import ProductCard from "@/components/ProductCard";

// Revalidate page every 60 seconds
export const revalidate = 60;

// Server Component - runs on server, better SEO and performance
export default async function ShopPage() {
  // Fetch products directly from service (no HTTP roundtrip needed)
  const products = await getAllProducts();

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

        {/* Results Info */}
        <div className="pb-6 flex items-center justify-between">
          <p className="text-text/60">Showing {products.length} products</p>
        </div>

        {/* Products Grid */}
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
    </div>
  );
}
