const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true, // Indexed for faster lookups by restaurant
        },
        menuItemName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        menuItemPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        menuItemCategory: {
            type: String,
            required: true, // e.g., 'Starter', 'Main Course', 'Dessert'
            trim: true,
        },
        isMenuItemVeg: {
            type: Boolean,
            default: true,
        },
        isMenuItemAvailable: {
            type: Boolean,
            default: true,
        },
        menuItemImage: {
            type: String,
            default: "",
        },
        menuItemDescription: {
            type: String,
            default: "",
            maxLength: 150,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
