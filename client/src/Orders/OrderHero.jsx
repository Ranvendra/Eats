import React from "react";

const OrderHero = () => {
  return (
    <div className="bg-white pt-10 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Grid Line */}
        

        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Left: Solid Structural Typography */}
          <div>
            <h1 className="text-5xl md:text4xl font-black text-green-600 tracking-tighter leading-none mb-2">
              Order History
            </h1>

          </div>

          {/* Right: Data Table Structure */}
          <div className="flex gap-16 md:gap-24 items-end">
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHero;
