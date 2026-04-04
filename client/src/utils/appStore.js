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
});

let syncTimeout;
let previousAuthState = false;

// Subscribe: on every state change, sync the cart to the Backend Database
appStore.subscribe(() => {
    const state = appStore.getState();
    const isAuthenticated = state.user?.isAuthenticated;
    const cart = state.cart;

    // CRITICAL FIX: If the user just logged OUT (auth state transitioned from true to false),
    // we must NOT sync the now-empty cart to the database.
    // This was the root bug: clearCart() on logout was triggering a sync that
    // erased the user's real cart from MongoDB.
    if (previousAuthState === true && isAuthenticated === false) {
        previousAuthState = false;
        clearTimeout(syncTimeout);
        return; // Bail out — do not persist the empty logout cart to DB
    }
    previousAuthState = isAuthenticated;

    // Only save if:
    // 1. User is logged in
    // 2. Cart has been hydrated from the DB (not just initialized to empty defaults)
    // 3. The cart actually has items (no point saving empty carts on every keystroke)
    if (isAuthenticated && cart?.isHydrated) {
        clearTimeout(syncTimeout);
        // Debounce to prevent DB spam when rapidly clicking +/-
        syncTimeout = setTimeout(() => {
            axiosInstance.post('/api/v1/cart/sync', cart).catch((err) => {
                console.error("Failed to sync cart:", err);
            });
        }, 1000);
    }
});

export default appStore;
