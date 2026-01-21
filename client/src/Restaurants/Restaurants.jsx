import React, { useState, useMemo, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import RestaurantFilters from "./RestaurantFilters";
import { Search, Loader2 } from "lucide-react";
import PaginationControls from "./PaginationControls";
import Navbar from "../HomePage/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { addRestaurants } from "../utils/restaurantSlice";

const Restaurants = () => {
  const dispatch = useDispatch();
  const restaurantList = useSelector((store) => store.restaurants.items);
  const meta = useSelector((store) => store.restaurants.meta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for current page
  const [page, setPage] = useState(1);
  const limit = 20;

  const [filters, setFilters] = useState({
    sortBy: "rating",
    cuisine: [],
    rating: 0,
    searchQuery: "",
    isVeg: null,
  });

  // Fetch Restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/v1/restaurants?page=${page}&limit=${limit}`,
        );
        dispatch(addRestaurants(response.data));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [dispatch, page]);

  // Extract unique cuisines
  const allCuisines = useMemo(() => {
    if (!restaurantList) return [];
    const cuisines = new Set();
    restaurantList.forEach((restaurant) => {
      restaurant.restaurantCuisine.forEach((c) => cuisines.add(c));
    });
    return Array.from(cuisines).sort();
  }, [restaurantList]);

  // Filter and Sort Logic
  const filteredRestaurants = useMemo(() => {
    if (!restaurantList) return [];
    let result = [...restaurantList];

    // Search Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.restaurantName.toLowerCase().includes(query) ||
          r.restaurantCuisine.some((c) => c.toLowerCase().includes(query)),
      );
    }

    // Cuisine Filter
    if (filters.cuisine.length > 0) {
      result = result.filter((r) =>
        r.restaurantCuisine.some((c) => filters.cuisine.includes(c)),
      );
    }

    // Rating Filter
    if (filters.rating > 0) {
      result = result.filter((r) => r.restaurantRating >= filters.rating);
    }

    // Veg/Non-Veg Filter
    if (filters.isVeg !== undefined && filters.isVeg !== null) {
      result = result.filter((r) => r.isVeg === filters.isVeg);
    }

    // Sorting
    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.restaurantRating - a.restaurantRating);
        break;
      case "deliveryTime":
        result.sort(
          (a, b) => a.restaurantDeliveryTime - b.restaurantDeliveryTime,
        );
        break;
      case "costLowToHigh":
        result.sort(
          (a, b) => 100 * a.restaurantRating - 100 * b.restaurantRating,
        );
        break;
      case "costHighToLow":
        result.sort(
          (a, b) => 100 * b.restaurantRating - 100 * a.restaurantRating,
        );
        break;
      default:
        break;
    }

    return result;
  }, [filters, restaurantList]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta?.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && (!restaurantList || restaurantList.length === 0)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#04b235] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Oops!</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-0 pt-10">
        <div className="sticky top-7 bg-white z-40 py-2 mb-10">
          <h1 className="text-2xl font-semibold text-gray-600 mb-5">
            World's Best Restaurants to explore
          </h1>
          <RestaurantFilters
            filters={filters}
            setFilters={setFilters}
            cuisines={allCuisines}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="h-full">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              No restaurants found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Try clearing some filters or searching for something else.
            </p>
            <button
              onClick={() =>
                setFilters({
                  sortBy: "rating",
                  cuisine: [],
                  rating: 0,
                  searchQuery: "",
                  isVeg: null,
                })
              }
              className="mt-6 text-[#04b235] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Premium Pagination Controls */}
        <PaginationControls
          page={page}
          totalPages={meta?.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Restaurants;
