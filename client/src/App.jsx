import React from "react";
import { ToastProvider } from "./Toast/ToastContext";
import Home from "./HomePage/Home";
import { Routes, Route } from "react-router-dom";
import Restaurants from "./Restaurants/Restaurants";
import RestaurantMenu from "./Restaurants/RestaurantMenu";
import About from "./About/About";
import Orders from "./Orders/Orders";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:resId" element={<RestaurantMenu />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="*"
          element={
            <div className="p-10 text-center">
              <h1>404 Page Not Found</h1>
              <p>The requested URL was not found.</p>
            </div>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;
