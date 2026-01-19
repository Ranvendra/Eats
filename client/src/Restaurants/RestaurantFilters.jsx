import React, { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Check,
  X,
  CheckCircle2,
  Circle,
} from "lucide-react";

const RestaurantFilters = ({ filters, setFilters, cuisines }) => {
  const [activeModal, setActiveModal] = useState(null); // 'sort' | 'filter' | null
  const [activeCategory, setActiveCategory] = useState("cuisine"); // 'cuisine' | 'rating' | 'veg'

  // Temporary state for filters inside the modal before applying
  const [tempFilters, setTempFilters] = useState({
    sortBy: filters.sortBy,
    cuisine: [...filters.cuisine],
    rating: filters.rating,
    isVeg: filters.isVeg || null, // null = all, true = veg, false = non-veg
  });

  const sortOptions = [
    { label: "Relevance (Default)", value: "rating" },
    { label: "Delivery Time", value: "deliveryTime" },
    { label: "Rating", value: "ratingRating" },
    { label: "Cost: Low to High", value: "costLowToHigh" },
    { label: "Cost: High to Low", value: "costHighToLow" },
  ];

  /* ------------------- Handlers ------------------- */

  const handleApplySort = (val) => {
    setFilters({ ...filters, sortBy: val });
    setActiveModal(null);
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      cuisine: tempFilters.cuisine,
      rating: tempFilters.rating,
      isVeg: tempFilters.isVeg,
    });
    setActiveModal(null);
  };

  const handleClearFilters = () => {
    setTempFilters({
      ...tempFilters,
      cuisine: [],
      rating: 0,
      isVeg: null,
    });
  };

  const toggleCuisine = (c) => {
    setTempFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(c)
        ? prev.cuisine.filter((item) => item !== c)
        : [...prev.cuisine, c],
    }));
  };

  const toggleRating = (r) => {
    setTempFilters((prev) => ({
      ...prev,
      rating: prev.rating === r ? 0 : r,
    }));
  };

  // Open Handlers
  const openSortModal = () => {
    setTempFilters({ ...filters }); // Sync temp state just in case
    setActiveModal("sort");
  };

  const openFilterModal = () => {
    setTempFilters({
      sortBy: filters.sortBy,
      cuisine: [...filters.cuisine],
      rating: filters.rating,
      isVeg: filters.isVeg,
    });
    setActiveModal("filter");
    setActiveCategory("cuisine");
  };

  // Active Counts
  const activeCount =
    (filters.cuisine.length > 0 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.isVeg !== undefined && filters.isVeg !== null ? 1 : 0);

  return (
    <div className="relative font-poppins">
      {/* Pills Row */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear">
        {/* Filter Button */}
        <button
          onClick={openFilterModal}
          className={`group flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm text-sm font-medium flex-shrink-0 transition-all ${
            activeCount > 0
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
          }`}
        >
          Filter <SlidersHorizontal className="w-4 h-4 ml-1" />
          {activeCount > 0 && (
            <span className="bg-[#04b235] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full -mr-1 font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Sort By Button */}
        <button
          onClick={openSortModal}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 flex-shrink-0 transition-all ${
            filters.sortBy !== "rating"
              ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800"
              : ""
          }`}
        >
          Sort By <ChevronDown className="w-4 h-4" />
          {filters.sortBy !== "rating" && (
            <span className="w-2 h-2 bg-[#04b235] rounded-full"></span>
          )}
        </button>
      </div>

      {/* ================= SORT MODAL (Small, Centered) ================= */}
      {activeModal === "sort" && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[1px] transition-opacity"
            onClick={() => setActiveModal(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-80 rounded-2xl shadow-xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">
                Sort Options
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options */}
            <div className="p-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex justify-between items-center cursor-pointer group p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => handleApplySort(option.value)}
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      filters.sortBy === option.value
                        ? "text-gray-900"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </span>
                  <div
                    className={`transition-colors ${
                      filters.sortBy === option.value
                        ? "text-[#04b235]"
                        : "text-gray-300 group-hover:text-gray-400"
                    }`}
                  >
                    {filters.sortBy === option.value ? (
                      <CheckCircle2 className="w-5 h-5 fill-[#04b235] text-white" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= FILTER MODAL (Large, Split View) ================= */}
      {activeModal === "filter" && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-[1px] transition-opacity"
            onClick={() => setActiveModal(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-2xl h-[450px] rounded-2xl shadow-xl z-[70] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                Filter
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar - Categories */}
              <div className="w-1/3 bg-gray-50/50 border-r border-gray-100 py-2">
                {/* Cuisines Category */}
                <button
                  onClick={() => setActiveCategory("cuisine")}
                  className={`w-full text-left px-5 py-3 text-sm font-medium border-l-4 transition-all flex justify-between items-center ${
                    activeCategory === "cuisine"
                      ? "bg-white border-[#04b235] text-[#04b235] shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  Cuisines
                  {tempFilters.cuisine.length > 0 && (
                    <span className="bg-gray-200 text-gray-700 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {tempFilters.cuisine.length}
                    </span>
                  )}
                </button>

                {/* Rating Category */}
                <button
                  onClick={() => setActiveCategory("rating")}
                  className={`w-full text-left px-5 py-3 text-sm font-medium border-l-4 transition-all flex justify-between items-center ${
                    activeCategory === "rating"
                      ? "bg-white border-[#04b235] text-[#04b235] shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  Ratings
                  {tempFilters.rating > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#04b235]"></div>
                  )}
                </button>

                {/* Veg/Non-Veg Category */}
                <button
                  onClick={() => setActiveCategory("veg")}
                  className={`w-full text-left px-5 py-3 text-sm font-medium border-l-4 border-transparent flex justify-between items-center transition-all ${
                    activeCategory === "veg"
                      ? "bg-white border-[#04b235] text-[#04b235] shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  Veg/Non-Veg
                  {tempFilters.isVeg !== null &&
                    tempFilters.isVeg !== undefined && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#04b235]"></div>
                    )}
                </button>
              </div>

              {/* Right Content - Options */}
              <div className="w-2/3 overflow-y-auto custom-scrollbar p-6 bg-white">
                {/* Cuisine Options */}
                {activeCategory === "cuisine" && (
                  <div className="space-y-2">
                    {cuisines.map((cuisine) => (
                      <label
                        key={cuisine}
                        className="flex items-center gap-3 cursor-pointer group py-1.5"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            tempFilters.cuisine.includes(cuisine)
                              ? "bg-[#04b235] border-[#04b235]"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {tempFilters.cuisine.includes(cuisine) && (
                            <Check className="w-3 h-3 text-white stroke-[3px]" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={tempFilters.cuisine.includes(cuisine)}
                          onChange={() => toggleCuisine(cuisine)}
                        />
                        <span
                          className={`text-sm ${
                            tempFilters.cuisine.includes(cuisine)
                              ? "font-medium text-gray-900"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {cuisine}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Rating Options */}
                {activeCategory === "rating" && (
                  <div className="space-y-3">
                    {[4.0, 4.5].map((rating) => (
                      <label
                        key={rating}
                        className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                          tempFilters.rating === rating
                            ? "border-[#04b235] bg-emerald-50/10"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                            tempFilters.rating === rating
                              ? "border-[#04b235]"
                              : "border-gray-300"
                          }`}
                        >
                          {tempFilters.rating === rating && (
                            <div className="w-2 h-2 bg-[#04b235] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="rating"
                          className="hidden"
                          checked={tempFilters.rating === rating}
                          onChange={() => toggleRating(rating)}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${
                              tempFilters.rating === rating
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            Rated {rating}+
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Veg/Non-Veg Options */}
                {activeCategory === "veg" && (
                  <div className="space-y-3">
                    {[
                      { label: "Pure Veg", value: true },
                      { label: "Non-Veg", value: false },
                      { label: "All", value: null },
                    ].map((option) => (
                      <label
                        key={String(option.value)}
                        className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                          tempFilters.isVeg === option.value
                            ? "border-[#04b235] bg-emerald-50/10"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                            tempFilters.isVeg === option.value
                              ? "border-[#04b235]"
                              : "border-gray-300"
                          }`}
                        >
                          {tempFilters.isVeg === option.value && (
                            <div className="w-2 h-2 bg-[#04b235] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="veg"
                          className="hidden"
                          checked={tempFilters.isVeg === option.value}
                          onChange={() =>
                            setTempFilters({
                              ...tempFilters,
                              isVeg: option.value,
                            })
                          }
                        />
                        <span
                          className={`text-sm font-medium ${
                            tempFilters.isVeg === option.value
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-gray-100 bg-white gap-3">
              <button
                onClick={handleClearFilters}
                className="text-gray-500 font-medium text-sm hover:text-gray-800 px-3 py-2 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleApplyFilters}
                className="bg-[#04b235] hover:bg-[#039f2f] text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-emerald-100 active:scale-95"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantFilters;
