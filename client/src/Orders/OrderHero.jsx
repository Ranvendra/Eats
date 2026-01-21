import React from "react";

const OrderHero = () => {
  return (
    <div className="bg-white pt-24 pb-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Grid Line */}
        <div className="w-full h-px bg-black mb-6"></div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Left: Solid Structural Typography */}
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none mb-2">
              ARCHIVE
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#12b603]"></div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Order History & Reorders
              </p>
            </div>
          </div>

          {/* Right: Data Table Structure */}
          <div className="flex gap-16 md:gap-24 items-end">
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Total Orders
              </span>
              <span className="block text-5xl font-medium text-black tracking-tight">
                24
              </span>
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Favorites
              </span>
              <span className="block text-5xl font-medium text-black tracking-tight">
                08
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHero;
