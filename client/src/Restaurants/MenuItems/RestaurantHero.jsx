import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowLeft } from "lucide-react";
import LazyImage from "../../LazyLoading/LazyImage";

const RestaurantHero = ({ restaurant }) => {
  return (
    <div className="relative h-[250px] md:h-[320px] w-full group">
      <LazyImage
        src={restaurant.restaurantImage}
        alt={restaurant.restaurantName}
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/restaurants"
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center gap-2 group/back"
        >
          <ArrowLeft
            size={18}
            className="group-hover/back:-translate-x-1 transition-transform"
          />
          <span className="hidden md:block text-xs font-medium">Back</span>
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
              {restaurant.restaurantName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium">
              <div className="flex items-center gap-1 bg-[#12b603] px-2 py-1 rounded-full text-white font-bold shadow-lg shadow-green-500/30">
                <Star size={14} fill="currentColor" />{" "}
                {restaurant.restaurantRating}
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <MapPin size={14} /> {restaurant.restaurantCity}
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Clock size={14} /> {restaurant.restaurantDeliveryTime} mins
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-gray-300 text-sm md:text-base">
              {restaurant.restaurantCuisine.map((cuisine, idx) => (
                <span
                  key={idx}
                  className="hover:text-white transition-colors cursor-default"
                >
                  {cuisine}{" "}
                  {idx !== restaurant.restaurantCuisine.length - 1 && "•"}
                </span>
              ))}
            </div>
          </div>

          {restaurant.offer && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl animate-float min-w-[200px]">
              <p className="text-xs uppercase tracking-widest text-[#12b603] font-bold mb-2">
                Offer of the day
              </p>
              <p className="text-xl font-black tracking-wide leading-none">
                {restaurant.offer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantHero;
