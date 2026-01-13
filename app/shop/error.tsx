"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shop page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h2 className="font-roboto-slab text-3xl font-bold text-text pb-4">
          Failed to Load Products
        </h2>
        <p className="text-text/70 pb-6">
          We couldn't load the products. This might be due to a database connection issue.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
