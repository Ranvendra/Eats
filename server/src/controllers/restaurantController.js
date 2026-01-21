const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const mongoose = require("mongoose");

const getAllRestaurants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const startIndex = (page - 1) * limit;
        const total = await Restaurant.countDocuments({});

        const restaurants = await Restaurant.find({}).skip(startIndex).limit(limit);

        res.status(200).json({
            data: restaurants,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching restaurants", error: err.message });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const { resId } = req.params;
        console.log("Fetching Restaurant ID:", resId);

        if (!mongoose.Types.ObjectId.isValid(resId)) {
            console.log("Invalid ID format");
            return res.status(400).json({ message: "Invalid Restaurant ID" });
        }

        const restaurant = await Restaurant.findById(resId);

        if (!restaurant) {
            console.log("Restaurant not found in DB");
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error("Error in getRestaurantById:", error);
        res.status(500).json({ message: "Error fetching restaurant details", error: error.message });
    }
};

const getRestaurantMenu = async (req, res) => {
    try {
        const { resId } = req.params;
        console.log("Fetching Menu for Restaurant ID:", resId);

        if (!mongoose.Types.ObjectId.isValid(resId)) {
            console.log("Invalid ID format for menu");
            return res.status(400).json({ message: "Invalid Restaurant ID" });
        }

        const restaurant = await Restaurant.findById(resId);
        if (!restaurant) {
            console.log("Restaurant not found for menu fetch");
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const menuItems = await MenuItem.find({ restaurantId: resId });

        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error: error.message });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    getRestaurantMenu,
};
