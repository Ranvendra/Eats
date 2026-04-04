import React, { useState, useEffect } from "react";
import Navbar from "../../HomePage/Navbar";
import CategorySidebar from "./CategorySidebar";
import MenuItemCard from "./MenuItemCard";

const RestaurantMenuLayout = ({ restaurant, categories }) => {
  const [activeCategory, setActiveCategory] = useState(
    categories?.[0]?.[0] || "Recommended",
  );

  // Update active category on scroll or mount if categories change
  useEffect(() => {
    if (categories?.length > 0 && !activeCategory) {
      setTimeout(() => {
        setActiveCategory(categories[0][0]);
      }, 0);
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
    <div className="min-h-screen bg-gray-50/50 menu-page-theme">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>


      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8 relative z-10 mr-35">
        <div className="flex flex-col lg:flex-row gap-15">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            scrollToCategory={scrollToCategory}
          />

          {/* Right Content (Grid of Menu Items) */}
          <div className="flex-1">
            <div className="space-y-12">
              {categories.map(([category, items]) => (
                <div key={category} id={category} className="scroll-mt-32">
                  <div className="mb-6 flex items-start gap-4 justify-between">
                    <div className="inline-block relative">
                       <h2 className="text-3xl font-black text-gray-900 leading-tight">
                         {category}
                       </h2>
                       <div className="h-1 w-full bg-[#04b235] rounded-full mt-1"></div>
                    </div>
                    {/* Optional Right-aligned Tags (Like the design: LOW CARB, ORGANIC) */}
                    <div className="hidden sm:flex gap-2 self-center">
                        <span className="text-[10px] font-bold text-[#04b235] border border-gray-200 px-4 py-1 rounded-full uppercase">
                           Fresh
                        </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {items.map((item) => (
                      <MenuItemCard key={item._id} item={item} restaurantId={restaurant?._id} restaurantName={restaurant?.restaurantName} />
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
