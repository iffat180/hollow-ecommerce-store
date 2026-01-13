import Link from "next/link";
import Button from "./ui/Button";
import { getAllProducts } from "@/lib/services/products.service";
import ProductCard from "./ProductCard";

// Server Component - fetches data on server for better performance
// Note: Caching is controlled by parent page component
export default async function FeaturedProducts() {
  // Fetch products directly from service
  const products = await getAllProducts();

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

      {/* Products */}
      {products.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-roboto text-text">
            No products available at the moment.
          </p>
        </div>
      )}
    </section>
  );
}
