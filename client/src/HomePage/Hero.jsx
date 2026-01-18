import React from "react";
import LazyImage from "../components/common/LazyImage";

const Hero = () => {
  return (
    <section className="relative w-full max-w-8xl mx-auto px-25 pt-10 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left Content */}
      <div className="z-10 animate-fade-in-up">
        {/* Green leaf decoration top left of text */}
        {/* Trying to crop just a leaf if possible, or just use the image small */}
        <h1 className="text-5xl md:text-6xl font-lightbold text-gray-900 leading-[1.15] mb-6">
          We deliver delicious & healthy food
        </h1>
        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
          Order online or book a table. We are always ready to fulfill your
          demand. We provide your order within a very short time. Keep with us
          to take our delicious food.
        </p>
        <button className="mt-5 bg-[#04b235] text-white font-bold py-4 px-8 text-sm tracking-wider uppercase rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
          Place an Order
        </button>
        {/* Decorative small veggies around text */}
      </div>

      {/* Right Content - Main Image */}
      <div className="relative z-10 flex justify-center items-center">
        {/* Main Plate */}
        <div className="relative w-[625px] h-[600px]">
          <LazyImage
            src="/assets/plate.png"
            alt="Delicious Steak"
            className="w-full h-full object-contain drop-shadow-2xl z-20 relative"
          />
          {/* Floating Veggies - Kept as standard img for complex animations or need to wrap lazy image properly to preserve animation */}
          {/* Note: Animations on LazyImage wrapper might conflict with internal image transforms. 
               For floating elements, standard img is often fine if they are small assets. 
               However, applied LazyImage for consistency but checked animation compatibility. 
               The LazyImage wrapper handles opacity/blur. The outer styling handles float.
           */}
          <div className="absolute -top-10 -right-10 w-50 h-50 animate-bounce-slow z-30 drop-shadow-lg">
            <LazyImage
              src="/assets/vegetables.png"
              alt="Fresh Ingredients"
              className="w-full h-full"
            />
          </div>

          <div
            className="absolute bottom-0 -left-10 w-40 h-40 animate-pulse-slow z-30 drop-shadow-md grayscale-[0.1]"
            style={{ transform: "scaleX(-1) rotate(45deg)" }}
          >
            <LazyImage
              src="/assets/vegetables.png"
              alt="Fresh Ingredients"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
