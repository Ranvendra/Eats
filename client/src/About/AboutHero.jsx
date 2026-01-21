import React from "react";
import LazyImage from "../LazyLoading/LazyImage";
import { ArrowDown } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="relative min-h-[90vh] bg-stone-50 flex items-center overflow-hidden px-14 pl-24 pt-10">
      <div className="max-w-8xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left: Bold Editorial Typography */}
        <div className="z-10 order-2 lg:order-1 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <span className="w-12 h-[2px] bg-black"></span>
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-gray-500">
              Est. 2024
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-blue-500 leading-[0.9] tracking-tighter mb-8">
            PURE.
            <br />
            <span className="text-[#12b603]">FRESH.</span>
            <br />
            REAL.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-md leading-relaxed mb-10 border-l-4 border-[#12b603] pl-6">
            We don't just deliver food. We bridge the gap between your cravings
            and the finest local kitchens.
          </p>

          <div className="flex items-center gap-6">
            <button className="bg-[#00c92b] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-green-600 transition-all duration-300">
              Explore Menu
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-black transition-colors">
              <div className="p-2 border border-gray-300 rounded-full">
                <ArrowDown size={14} />
              </div>
              Discover More
            </div>
          </div>
        </div>

        {/* Right: Freestanding Premium Visual */}
        <div className="relative order-1 lg:order-2 h-[500px] lg:h-[700px] flex items-center justify-center">
          {/* Abstract Green Shape Background */}
          <div className="absolute inset-0 bg-[#dcfce7] rounded-tl-[150px] rounded-br-[150px] transform rotate-3 scale-90 -z-10"></div>

          {/* Main Image */}
          <div className="relative w-full h-full rounded-tl-[120px] rounded-br-[120px] overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
            <LazyImage
              src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2070&auto=format&fit=crop"
              alt="Fresh Salad Bowl"
              className="w-full h-full object-cover"
            />

            {/* Floating Badge */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-full shadow-xl animate-float">
              <div className="text-center leading-none">
                <span className="block text-3xl font-black text-[#12b603]">
                  100%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
                  Organic
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
