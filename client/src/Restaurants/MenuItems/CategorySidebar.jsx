import React from "react";
import { Utensils } from "lucide-react";

const CategorySidebar = ({ categories, activeCategory, scrollToCategory }) => {
  return (
    <>
      {/* Left Sidebar (Sticky Category Nav) - Desktop Only */}
      <div className="lg:block w-56 shrink-0">
        <div className="sticky top-28 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-hide">
          <div className="mb-6 px-3">
             <h3 className="text-2xl text-gray-800 font-extrabold tracking-tight">
               Categories
             </h3>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
               Freshly Prepared
             </p>
          </div>
          {categories.map(([category]) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 group text-sm
                          ${
                            isActive
                              ? "bg-[#04b235]/10 text-[#04b235] font-bold shadow-[inset_0_0_0_1px_rgba(4,178,53,0.05)] border-l-4 border-[#04b235]"
                              : "hover:bg-gray-50 text-gray-600 font-semibold border-l-4 border-transparent"
                          }`}
              >
                <Utensils size={16} className={isActive ? "text-[#00b935]" : "text-gray-400 group-hover:text-gray-600"} />
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Horizontal Category Scroll */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 scrollbar-hide sticky top-20 z-40 bg-white/95 backdrop-blur -mx-4 px-4 pt-2 border-b border-gray-100">
        {categories.map(([category]) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full shadow-sm text-sm font-bold transition-colors flex items-center gap-2 border ${
                    isActive 
                    ? "bg-[#04b235]/10 border-[#04b235]/20 text-[#04b235]" 
                    : "bg-white border-gray-200 text-gray-600 active:bg-gray-50"
                }`}
              >
                <Utensils size={14} className={isActive ? "text-[#04b235]" : "text-gray-400"} />
                {category}
              </button>
            )
        })}
      </div>
    </>
  );
};

export default CategorySidebar;
