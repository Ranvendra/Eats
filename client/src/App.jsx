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
  // Tracks whether the initial page-load auth+cart fetch has completed,
  // so the isAuthenticated watcher doesn't race and double-fetch.
  const initialLoadDone = React.useRef(false);

  const fetchCart = React.useCallback(async () => {
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
  }, [dispatch]);

  // 1. Initial Load: Check Auth + immediately load cart in same sequence
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getProfile();
        const userData = response?.data || response?.user;
        if (userData) {
          dispatch(loginSuccess(userData));
          await fetchCart(); // Load cart inline — prevents race with watcher below
        } else {
          dispatch(clearCart());
          dispatch(setAuthInitialized());
        }
      } catch {
        dispatch(clearCart());
        dispatch(setAuthInitialized());
      } finally {
        initialLoadDone.current = true; // Mark initial load as done
      }
    };
    fetchUser();
  }, [dispatch, fetchCart]);

  // 2. Subsequent logins: Re-fetch cart when auth state changes AFTER initial load
  useEffect(() => {
    if (!initialLoadDone.current) return; // Skip during initial page load
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

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
