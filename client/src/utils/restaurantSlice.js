import { createSlice } from "@reduxjs/toolkit";

const restaurantSlice = createSlice({
    name: "restaurants",
    initialState: {
        items: [],
        meta: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1,
        }
    },
    reducers: {
        addRestaurants: (state, action) => {
            state.items = action.payload.data;
            state.meta = action.payload.meta;
        },
    },
});

export const { addRestaurants } = restaurantSlice.actions;

export default restaurantSlice.reducer;
