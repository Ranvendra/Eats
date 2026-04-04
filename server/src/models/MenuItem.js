const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true,
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
            required: true,
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
            maxLength: 200,
        },
        menuItemRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        menuItemCalories: {
            type: Number,
            default: null, // optional — null if not provided
        },
        menuItemServes: {
            type: String,
            default: "1", // e.g. "2-3 people"
        },
    },
    {
        timestamps: true,
    }
);

// Compound index — fast lookups for "all menu items for restaurant X in category Y"
menuItemSchema.index({ restaurantId: 1, menuItemCategory: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
