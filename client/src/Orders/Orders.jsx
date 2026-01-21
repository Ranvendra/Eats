import React from "react";
import Navbar from "../HomePage/Navbar";
import OrderHistory from "./OrderHistory";
import AboutFooter from "../About/AboutFooter"; // Reusing our nice footer

const Orders = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-poppins">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Orders Feed */}
          <OrderHistory />
        </div>
      </main>

      <AboutFooter />
    </div>
  );
};

export default Orders;
