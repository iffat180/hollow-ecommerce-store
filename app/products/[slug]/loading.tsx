export default function ProductLoading() {
  return (
    <main className="pb-16 pt-4 md:pb-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="pb-3">
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16">
          {/* Image Skeleton */}
          <div className="h-96 md:h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>

          {/* Details Skeleton */}
          <div className="flex flex-col space-y-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded w-64"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-48"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="border-t border-text/10 pt-6">
          <div className="flex gap-8 pb-4">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
