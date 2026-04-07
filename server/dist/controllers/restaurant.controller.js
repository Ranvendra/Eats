"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Make sure to convert Restaurant to TS model next, or just import like this for now
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
class RestaurantController {
    getAllRestaurants = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const startIndex = (page - 1) * limit;
            const total = await Restaurant_1.default.countDocuments({});
            const restaurants = await Restaurant_1.default.find({}).skip(startIndex).limit(limit);
            res.status(200).json({
                data: restaurants,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            });
        }
        catch (err) {
            res.status(500).json({ message: "Error fetching restaurants", error: err.message });
        }
    };
    getRestaurantById = async (req, res) => {
        try {
            const resId = req.params.resId;
            if (!mongoose_1.default.Types.ObjectId.isValid(resId)) {
                console.log("Invalid ID format");
                return res.status(400).json({ message: "Invalid Restaurant ID" });
            }
            const restaurant = await Restaurant_1.default.findById(resId);
            if (!restaurant) {
                console.log("Restaurant not found in DB");
                return res.status(404).json({ message: "Restaurant not found" });
            }
            res.status(200).json(restaurant);
        }
        catch (error) {
            console.error("Error in getRestaurantById:", error);
            res.status(500).json({ message: "Error fetching restaurant details", error: error.message });
        }
    };
    getRestaurantMenu = async (req, res) => {
        try {
            const resId = req.params.resId;
            if (!mongoose_1.default.Types.ObjectId.isValid(resId)) {
                console.log("Invalid ID format for menu");
                return res.status(400).json({ message: "Invalid Restaurant ID" });
            }
            const restaurant = await Restaurant_1.default.findById(resId);
            if (!restaurant) {
                console.log("Restaurant not found for menu fetch");
                return res.status(404).json({ message: "Restaurant not found" });
            }
            const menuItems = await MenuItem_1.default.find({ restaurantId: resId });
            res.status(200).json(menuItems);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching menu items", error: error.message });
        }
    };
}
exports.default = RestaurantController;
//# sourceMappingURL=restaurant.controller.js.map