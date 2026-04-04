import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "./api/authApi";
import { loginSuccess, setAuthInitialized } from "./utils/userSlice";
import { loadCart, clearCart } from "./utils/cartSlice";
import axiosInstance from "./api/axiosInstance";
import { ToastProvider } from "./Toast/ToastContext";
import Home from "./HomePage/Home";
import { Routes, Route } from "react-router-dom";
import Restaurants from "./Restaurants/Restaurants";
import RestaurantMenu from "./Restaurants/RestaurantMenu";
import About from "./About/About";
import Orders from "./Orders/Orders";
import Profile from "./Profile/Profile";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store) => store.user?.isAuthenticated);

  // 1. Initial Load: Check Authentication Status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getProfile();
        const userData = response?.data || response?.user;

        if (userData) {
          dispatch(loginSuccess(userData));
        } else {
          dispatch(clearCart());
          dispatch(setAuthInitialized());
        }
      } catch {
        dispatch(clearCart());
        dispatch(setAuthInitialized());
      }
    };
    fetchUser();
  }, [dispatch]);

  // 2. Cart Hydration: Fetch cart data dynamically whenever a user logs in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchCart = async () => {
        try {
           const cartRes = await axiosInstance.get('/api/v1/cart');
           const savedCart = cartRes.data?.data;
           if (savedCart && savedCart.items?.length > 0) {
             dispatch(loadCart(savedCart));
           } else {
             dispatch(loadCart({ items: [], totalQuantity: 0, totalAmount: 0 }));
           }
        } catch {
           dispatch(loadCart({ items: [], totalQuantity: 0, totalAmount: 0 }));
        }
      };
      fetchCart();
    }
  }, [isAuthenticated, dispatch]);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:resId" element={<RestaurantMenu />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
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
