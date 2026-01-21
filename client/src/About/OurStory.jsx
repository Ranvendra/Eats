import React from "react";
import LazyImage from "../LazyLoading/LazyImage";

const OurStory = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-8xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Magazine Style Text */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-[#12b603]"></div>
            <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              Since 2024
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1]">
            It all started with <br />a{" "}
            <span className="text-[#12b603] italic">craving.</span>
          </h2>

          <div className="text-gray-600 text-lg space-y-6 font-light leading-relaxed">
            <p>
              Good food is a universal language, but finding it shouldn't be a
              treasure hunt. We built Eats on a simple premise:
              <strong className="text-gray-900 font-medium">
                {" "}
                Connect the best local chefs with the hungriest neighbors.
              </strong>
            </p>
            <p>
              We don't believe in "fast food" in the traditional sense. We
              believe in good food, delivered fast. Every restaurant on our
              platform is hand-picked for quality, hygiene, and soul.
            </p>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-4">
              <LazyImage
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Founder"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#12b603] p-0.5"
              />
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  Ranvendra Singh
                </p>
                <p className="text-[#12b603] text-sm font-medium">
                  Founder & CEO
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Modern Collage */}
        <div className="relative order-1 lg:order-2 h-[500px] md:h-[600px]">
          {/* Main large image */}
          <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-[2.5rem] overflow-hidden shadow-2xl z-10">
            <LazyImage
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
              alt="Chefs Cooking"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Floating secondary image */}
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-[2rem] overflow-hidden shadow-xl z-20 border-8 border-white">
            <LazyImage
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
              alt="Fresh Food"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
