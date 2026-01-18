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
            maxLength: 200,
        },
        restaurantCity: {
            type: String,
            required: true,
            trim: true,
            index: true, // Indexed for faster search by city
        },
        restaurantCuisine: {
            type: [String], // Array of strings for multiple cuisines
            required: true,
        },
        restaurantRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        restaurantDeliveryTime: {
            type: Number, // In minutes
            required: true,
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
            maxLength: 250,
        },
        isRestaurantPromoted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Optional: compound index if searching by city and cuisine often
restaurantSchema.index({ restaurantCity: 1, restaurantCuisine: 1 });

module.exports = mongoose.model("Restaurant", restaurantSchema);
