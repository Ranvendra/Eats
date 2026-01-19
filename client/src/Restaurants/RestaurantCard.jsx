import React from "react";
import { Star } from "lucide-react";
import LazyImage from "../LazyLoading/LazyImage";

const RestaurantCard = ({ restaurant }) => {
  const {
    restaurantName,
    restaurantAddress,
    restaurantCuisine,
    restaurantRating,
    restaurantDeliveryTime,
    restaurantImage,
    isRestaurantPromoted,
    offer,
  } = restaurant;

  return (
    <div className="group cursor-pointer hover:scale-[0.98] transition-all duration-300">
      {/* Image Container with Rounded Corners */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm">
        <LazyImage
          src={restaurantImage}
          alt={restaurantName}
          className="w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/90 to-transparent"></div>

        {/* Offer Text Overlay */}
        {offer && (
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-extrabold text-xl tracking-tighter uppercase leading-none drop-shadow-md">
              {offer}
            </h3>
          </div>
        )}

        {/* Promoted Tag */}
        {isRestaurantPromoted && (
          <div className="absolute top-0 right-0 m-0">
            {/* Optional promoted UI if needed, usually just 'Ad' text below */}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="pt-3 px-1">
        {/* Name and Rating Row */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-2">
            {restaurantName}
          </h3>
        </div>

        {/* Rating and Time */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex items-center justify-center bg-[#12b603] rounded-full w-5 h-5">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">
            {restaurantRating} • {restaurantDeliveryTime}-
            {restaurantDeliveryTime + 5} mins
          </span>
        </div>

        {/* Cuisine and Address */}
        <div className="mt-1 text-gray-500 text-sm truncate">
          {restaurantCuisine.join(", ")}
        </div>
        <div className="text-gray-500 text-sm truncate">
          {restaurantAddress}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
