import React from "react";

const MenuShimmer = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Shimmer */}
      <div className="bg-gray-100 h-64 rounded-3xl mb-8 relative">
        <div className="absolute -bottom-10 left-8 md:left-16 w-32 h-32 bg-gray-200 rounded-full border-4 border-white"></div>
      </div>

      <div className="mt-16 space-y-4">
        <div className="hidden md:block h-8 bg-gray-200 w-1/4 rounded mb-8"></div>
        {/* Menu Items Shimmer */}
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 rounded-xl"
          >
            <div className="h-32 w-full md:w-32 bg-gray-200 rounded-lg shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-3 bg-gray-200 w-full rounded"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded self-end md:self-center"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuShimmer;
