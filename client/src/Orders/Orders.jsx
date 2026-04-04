import React from "react";
import Navbar from "../HomePage/Navbar";
import OrderHistory from "./OrderHistory";
import AboutFooter from "../About/AboutFooter"; // Reusing our nice footer
import { useSelector } from "react-redux";


const Orders = () => {
  const { isAuthenticated, isInitialized } = useSelector((store) => store.user);
  
  // Optional: If you ever want to force redirect unauthenticated users who manually type /orders
  // For now, if they aren't initialized or logged in, we shouldn't show sensitive order history.

  if (isInitialized && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 font-poppins flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
            <p className="text-gray-500">Please login from the navbar to view your orders.</p>
          </div>
        </div>
        <AboutFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-poppins flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <main className="pt-10 pb-0 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Orders Feed */}
          <OrderHistory />
        </div>
      </main>

      <AboutFooter />
    </div>
  );
};

export default Orders;
