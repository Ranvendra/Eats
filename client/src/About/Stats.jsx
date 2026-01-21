import React from "react";

const stats = [
  { label: "Restaurants Partnered", value: "500+" },
  { label: "Satisfied Customers", value: "50k+" },
  { label: "Cities Operaing", value: "25+" },
  { label: "Average Delivery", value: "30m" },
];

const Stats = () => {
  return (
    <section className="relative py-12 -mt-20 z-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Glassmorphic Strip */}
        <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] border border-white/40 p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center px-4 group py-4 md:py-0"
              >
                <div className="mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="text-5xl md:text-6xl font-black text-amber-500 tracking-tighter leading-none">
                    {stat.value}
                  </span>
                </div>
                <p className="font-serif italic text-gray-500 text-lg md:text-xl font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
