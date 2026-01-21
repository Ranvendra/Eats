import React from "react";
import LazyImage from "../LazyLoading/LazyImage";
import { RefreshCcw, CheckCircle, Clock } from "lucide-react";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group">
      {/* Hero Image Section */}
      <div className="relative h-64 overflow-hidden">
        <LazyImage
          src={order.image}
          alt={order.restaurantName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          {order.status === "Delivered" ? (
            <CheckCircle
              size={16}
              className="text-[#12b603]"
              fill="#12b603"
              color="white"
            />
          ) : (
            <Clock size={16} className="text-orange-500" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            {order.status}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full">
          <span className="text-xs font-bold tracking-wider">{order.date}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2 group-hover:text-[#12b603] transition-colors">
              {order.restaurantName}
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              {order.location || "Downtown Gourmet"}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-black text-gray-900">
              ₹{order.total}
            </span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {order.items.length} Items
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 py-6 mb-6">
          <ul className="flex flex-wrap gap-2">
            {order.items.map((item, index) => (
              <li
                key={index}
                className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-lg border border-gray-100"
              >
                {item}
              </li>
            ))}
            {order.items.length > 3 && (
              <li className="text-sm text-gray-400 px-2 py-1">+ more</li>
            )}
          </ul>
        </div>

        <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#12b603] transition-colors flex items-center justify-center gap-3">
          <RefreshCcw size={18} />
          Reorder
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
