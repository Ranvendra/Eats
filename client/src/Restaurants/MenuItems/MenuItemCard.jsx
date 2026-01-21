import React from "react";
import { Plus } from "lucide-react";
import LazyImage from "../../LazyLoading/LazyImage";

const MenuItemCard = ({ item }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
      {/* Premium Large Image Area (60%) */}
      <div className="relative h-58 overflow-hidden shrink-0">
        {item.menuItemImage ? (
          <LazyImage
            src={item.menuItemImage}
            alt={item.menuItemName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" // Subtle zoom
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
            <span className="text-3xl font-black opacity-20">EATS</span>
          </div>
        )}

        {/* Floating Action Button */}
        <button className="absolute bottom-3 right-3 bg-white text-black p-2.5 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#12b603] hover:text-white z-10">
          <Plus size={20} strokeWidth={3} />
        </button>

        {item.isMenuItemAvailable && item.isMenuItemVeg && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div> VEG
          </div>
        )}
        {item.isMenuItemAvailable && !item.isMenuItemVeg && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> NON-VEG
          </div>
        )}
      </div>

      {/* Content Area (40%) */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#04b235] transition-colors line-clamp-1">
            {item.menuItemName}
          </h3>
          <span className="text-base font-black text-gray-900 whitespace-nowrap ml-2">
            ₹{item.menuItemPrice}
          </span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
          {item.menuItemDescription}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          {!item.isMenuItemAvailable ? (
            <span className="text-red-500 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-lg">
              Sold Out
            </span>
          ) : (
            <button className="w-full bg-gray-50 hover:bg-black hover:text-white text-gray-900 font-bold py-2.5 rounded-xl transition-all duration-300 text-xs tracking-wide uppercase">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
