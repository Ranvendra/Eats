import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Array of objects: { menuItemId, menuItemName, menuItemPrice, itemQuantity, menuItemImage, isMenuItemVeg }
    totalQuantity: 0,
    totalAmount: 0,
    restaurantId: null,
    restaurantName: null,
    isHydrated: false, // Tracks if cart has been loaded from storage
  },
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      // Store restaurant context
      if (newItem.restaurantId) state.restaurantId = newItem.restaurantId;
      if (newItem.restaurantName) state.restaurantName = newItem.restaurantName;
      const existingItem = state.items.find((item) => item.menuItemId === newItem.menuItemId);

      // If the item exists and the user hits confirm with a new specific quantity
      if (existingItem) {
        // Find difference to update totals properly
        const difference = newItem.itemQuantity - existingItem.itemQuantity;
        state.totalQuantity += difference;
        state.totalAmount += difference * newItem.menuItemPrice;
        
        existingItem.itemQuantity = newItem.itemQuantity;
      } else {
        // Brand new item
        state.items.push(newItem);
        state.totalQuantity += newItem.itemQuantity;
        state.totalAmount += newItem.itemQuantity * newItem.menuItemPrice;
      }
      state.isHydrated = true; // Any action makes it "active" for saving
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.menuItemId === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.itemQuantity;
        state.totalAmount -= existingItem.itemQuantity * existingItem.menuItemPrice;
        state.items = state.items.filter((item) => item.menuItemId !== id);
      }
    },
    updateQuantity: (state, action) => {
        const { id, quantity } = action.payload;
        const existingItem = state.items.find(item => item.menuItemId === id);
        
        if (existingItem) {
            const difference = quantity - existingItem.itemQuantity;
            state.totalQuantity += difference;
            state.totalAmount += difference * existingItem.menuItemPrice;
            existingItem.itemQuantity = quantity;
        }
        state.isHydrated = true;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.restaurantId = null;
      state.restaurantName = null;
    },
    // Hydrate the full cart from localStorage after auth confirms user identity
    loadCart: (_state, action) => {
      return { ...action.payload, isHydrated: true }; // fully replace and mark as hydrated
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
