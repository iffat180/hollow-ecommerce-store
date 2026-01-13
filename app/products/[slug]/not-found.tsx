import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl font-roboto-slab font-bold text-text mb-4">
        Product Not Found
      </h1>
      <p className="text-text/70 mb-8">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/shop">
        <Button>Back to Shop</Button>
      </Link>
    </main>
  );
}
