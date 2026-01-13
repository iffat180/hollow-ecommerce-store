export default function ShopLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
        {/* Header Skeleton */}
        <div className="pb-8">
          <div className="h-12 w-96 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Results Info Skeleton */}
        <div className="pb-6">
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
