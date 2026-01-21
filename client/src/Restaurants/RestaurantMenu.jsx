import React from "react";
import { useParams, Link } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import MenuShimmer from "../Shimmer/MenuShimmer";
import { ArrowLeft } from "lucide-react";
import RestaurantMenuLayout from "./MenuItems/RestaurantMenuLayout";

const RestaurantMenu = () => {
  const { resId } = useParams();
  const { restaurant, menuItems, loading, error } = useRestaurantMenu(resId);

  if (loading) return <MenuShimmer />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4 font-poppins">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500 mb-6">
            {error?.message ||
              "We couldn't load the menu. Please try again later."}
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 bg-[#12b603] text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  // Group menu items by category (Business Logic)
  const getCategories = () => {
    const categories = {};
    menuItems.forEach((item) => {
      if (!categories[item.menuItemCategory]) {
        categories[item.menuItemCategory] = [];
      }
      categories[item.menuItemCategory].push(item);
    });
    return Object.entries(categories);
  };

  const categories = getCategories();

  // Render the Presentational Component
  return (
    <RestaurantMenuLayout restaurant={restaurant} categories={categories} />
  );
};

export default RestaurantMenu;
