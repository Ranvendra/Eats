import React, { useState, useEffect } from "react";
import Navbar from "../../HomePage/Navbar";
import RestaurantHero from "./RestaurantHero";
import CategorySidebar from "./CategorySidebar";
import MenuItemCard from "./MenuItemCard";

const RestaurantMenuLayout = ({ restaurant, categories }) => {
  const [activeCategory, setActiveCategory] = useState(
    categories?.[0]?.[0] || "Recommended",
  );

  // Update active category on scroll or mount if categories change
  useEffect(() => {
    if (categories?.length > 0 && !activeCategory) {
      setActiveCategory(categories[0][0]);
    }
  }, [categories, activeCategory]);

  // Scroll to category function
  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-poppins">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <RestaurantHero restaurant={restaurant} />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            scrollToCategory={scrollToCategory}
          />

          {/* Right Content (Grid of Menu Items) */}
          <div className="flex-1">
            <div className="space-y-12">
              {categories.map(([category, items]) => (
                <div key={category} id={category} className="scroll-mt-28">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-end gap-3">
                    {category}
                    <div className="h-0.5 flex-1 bg-gray-100 rounded-full mb-1.5"></div>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <MenuItemCard key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenuLayout;
