import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./restaurantSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import axiosInstance from "../api/axiosInstance";

const appStore = configureStore({
    reducer: {
        restaurants: restaurantReducer,
        cart: cartReducer,
        user: userReducer,
    },
    // Note: preloadedState for cart is injected dynamically in App.jsx
    // after auth hydration. This avoids loading a guest cart for a logged-in user.
});

let syncTimeout;

// Subscribe: on every state change, sync the cart to the Backend Database
appStore.subscribe(() => {
    const state = appStore.getState();
    const isAuthenticated = state.user?.isAuthenticated;
    
    // Only save if logged in AND the cart has been hydrated/initialized from initial DB load.
    // This prevents the initial empty state from overwriting a real cart on refresh.
    if (isAuthenticated && state.cart?.isHydrated) {
        clearTimeout(syncTimeout);
        // Debounce to prevent DB spam when rapidly clicking +/-
        syncTimeout = setTimeout(() => {
            axiosInstance.post('/api/v1/cart/sync', state.cart).catch((err) => {
                console.error("Failed to sync cart:", err);
            });
        }, 1000);
    }
});

export default appStore;
