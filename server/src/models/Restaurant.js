const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        restaurantAddress: {
            type: String,
            required: true,
            maxLength: 300,
        },
        restaurantCity: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        restaurantPincode: {
            type: String,
            default: "",
        },
        restaurantPhone: {
            type: String,
            default: "",
        },
        restaurantCuisine: {
            type: [String],
            required: true,
        },
        restaurantRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        restaurantTotalRatings: {
            type: Number,
            default: 0, // tracks total number of ratings for averaging
        },
        restaurantDeliveryTime: {
            type: Number, // In minutes
            required: true,
        },
        restaurantMinOrder: {
            type: Number,
            default: 0, // Minimum order amount in ₹
        },
        isRestaurantOpen: {
            type: Boolean,
            default: true,
        },
        restaurantImage: {
            type: String,
            required: true,
        },
        restaurantDescription: {
            type: String,
            default: "",
            maxLength: 500,
        },
        isRestaurantPromoted: {
            type: Boolean,
            default: false,
        },
        offer: {
            type: String,
            default: "", // e.g. "20% OFF" or "Free Delivery"
        },
        restaurantTags: {
            type: [String],
            default: [], // e.g. ["Budget", "Family Friendly", "Trending"]
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for common query pattern: city + cuisine
restaurantSchema.index({ restaurantCity: 1, restaurantCuisine: 1 });

module.exports = mongoose.model("Restaurant", restaurantSchema);
