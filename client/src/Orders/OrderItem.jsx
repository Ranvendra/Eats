import React from "react";
import LazyImage from "../LazyLoading/LazyImage";
import { ArrowUpRight } from "lucide-react";

const OrderItem = ({ order }) => {
  return (
    <div className="group bg-white border-b border-gray-200 py-8 hover:bg-stone-50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Precise Image Block */}
        <div className="w-full md:w-56 h-40 relative flex-shrink-0">
          <LazyImage
            src={order.image}
            alt={order.restaurantName}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          {/* Status Tag - Technical/Label Style */}
          <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
            {order.status}
          </div>
        </div>

        {/* Right: Structured Content */}
        <div className="flex-grow flex flex-col justify-between h-40">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-black tracking-tight mb-1 group-hover:text-[#12b603] transition-colors">
                {order.restaurantName}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {order.date} — {order.location}
              </p>
            </div>
            <span className="text-xl font-medium text-black">
              ₹{order.total}
            </span>
          </div>

          {/* Items List */}
          <div className="mt-4 md:mt-0">
            <p className="text-sm font-medium text-gray-600 max-w-xl leading-relaxed">
              {order.items.join(", ")}
            </p>
          </div>

          {/* Action Bottom Row */}
          <div className="mt-auto pt-4 flex justify-between items-end">
            <div className="h-px w-24 bg-gray-300 group-hover:w-full group-hover:bg-[#12b603] transition-all duration-700 ease-in-out"></div>
            <button className="flex items-center gap-2 text-black text-sm font-bold uppercase tracking-widest group/btn hover:text-[#12b603] transition-colors">
              Reorder
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
