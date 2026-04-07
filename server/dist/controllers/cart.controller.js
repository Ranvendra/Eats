"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_1 = __importDefault(require("../models/Cart"));
class CartController {
    getCart = async (req, res) => {
        try {
            const userId = req.user._id;
            let cart = await Cart_1.default.findOne({ userId });
            if (!cart) {
                cart = new Cart_1.default({ userId });
                await cart.save();
            }
            res.json({ success: true, data: cart });
        }
        catch (error) {
            console.error("Fetch Cart Error:", error);
            res.status(500).json({ success: false, message: "Could not fetch cart" });
        }
    };
    syncCart = async (req, res) => {
        try {
            const userId = req.user._id;
            const { items, totalQuantity, totalAmount, restaurantId, restaurantName } = req.body;
            let cart = await Cart_1.default.findOneAndUpdate({ userId }, {
                items: items || [],
                totalQuantity: totalQuantity || 0,
                totalAmount: totalAmount || 0,
                restaurantId: restaurantId || null,
                restaurantName: restaurantName || null
            }, { new: true, upsert: true });
            res.json({ success: true, data: cart });
        }
        catch (error) {
            console.error("Sync Cart Error:", error);
            res.status(500).json({ success: false, message: "Could not sync cart" });
        }
    };
    clearCart = async (req, res) => {
        try {
            const userId = req.user._id;
            const emptyCart = {
                items: [],
                totalQuantity: 0,
                totalAmount: 0,
                restaurantId: null,
                restaurantName: null
            };
            const cart = await Cart_1.default.findOneAndUpdate({ userId }, emptyCart, { new: true, upsert: true });
            res.json({ success: true, data: cart });
        }
        catch (error) {
            console.error("Clear Cart Error:", error);
            res.status(500).json({ success: false, message: "Could not clear cart" });
        }
    };
}
exports.default = CartController;
//# sourceMappingURL=cart.controller.js.map