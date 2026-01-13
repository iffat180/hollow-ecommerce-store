import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/products.service";
import ProductDetailClient from "@/components/ProductDetailClient";
import Button from "@/components/ui/Button";
import Link from "next/link";

// Revalidate product pages every 5 minutes
export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Server Component - better SEO, faster initial load
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product directly from service (server-side)
  const product = await getProductBySlug(slug);

  // Return 404 if product not found
  if (!product) {
    notFound();
  }

  return (
    <main className="pb-16 pt-4 md:pb-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm pb-3 text-text/70">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        {/* Client Component handles interactive features */}
        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}
