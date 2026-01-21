import React from "react";
import OrderItem from "./OrderItem";
import OrderHero from "./OrderHero";

const mockOrders = [
  {
    id: "ord_001",
    restaurantName: "The Burger Sanctuary",
    location: "Sector 18, Noida",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2799&auto=format&fit=crop",
    items: ["Double Truffle Burger", "Crispy Fries", "Vanilla Swirl Shake"],
    total: 850,
    date: "Jan 12, 2024",
    status: "Delivered",
  },
  {
    id: "ord_002",
    restaurantName: "Sushi Master",
    location: "Cyber Hub, Gurgaon",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
    items: ["Salmon Nigiri Platter", "Spicy Tuna Roll", "Edamame", "Miso Soup"],
    total: 2100,
    date: "Jan 08, 2024",
    status: "Delivered",
  },
  {
    id: "ord_003",
    restaurantName: "Pizza Paradise",
    location: "Connaught Place, Delhi",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop",
    items: ["Farmhouse Pizza", "Garlic Breadstix", "Coke Zero"],
    total: 650,
    date: "Dec 30, 2023",
    status: "Delivered",
  },
  {
    id: "ord_004",
    restaurantName: "Biryani Blues",
    location: "Golf Course Road",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2574&auto=format&fit=crop",
    items: [
      "Hyderabadi Chicken Biryani",
      "Mirchi Ka Salan",
      "Raita",
      "Gulab Jamun",
    ],
    total: 950,
    date: "Dec 25, 2023",
    status: "Delivered",
  },
];

const OrderHistory = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <OrderHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col">
          {mockOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <OrderItem order={order} />
            </div>
          ))}
        </div>

        {/* Footer Line */}
        <div className="w-full h-px bg-black mt-12"></div>
        <div className="mt-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
          <span>End of Archive</span>
          <span>2024</span>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
