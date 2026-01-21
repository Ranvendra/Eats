import React from "react";

const CategorySidebar = ({ categories, activeCategory, scrollToCategory }) => {
  return (
    <>
      {/* Left Sidebar (Sticky Category Nav) - Desktop Only */}
      <div className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-28 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-hide">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2 px-3">
            Menu
          </h3>
          {categories.map(([category, items]) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300 flex justify-between items-center group text-sm
                        ${
                          activeCategory === category
                            ? "bg-black text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-600 font-medium"
                        }`}
            >
              <span>{category}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category
                    ? "bg-white/20"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Category Scroll */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-6 scrollbar-hide sticky top-20 z-40 bg-gray-50/50 backdrop-blur-sm -mx-4 px-4 pt-2">
        {categories.map(([category, items]) => (
          <button
            key={category}
            onClick={() => scrollToCategory(category)}
            className="whitespace-nowrap px-6 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 active:bg-black active:text-white transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategorySidebar;
