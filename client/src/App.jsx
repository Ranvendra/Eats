import React from "react";
import { ToastProvider } from "./Toast/ToastContext";
import Home from "./HomePage/Home";

import { Routes, Route } from "react-router-dom";
import Restaurants from "./Restaurants/Restaurants";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/" element={<Home />} />
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
