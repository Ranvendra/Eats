const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Cart = require("../models/Cart");

const cartRouter = express.Router();

/**
 * GET /api/v1/cart
 * Fetch the logged-in user's cart
 */
cartRouter.get("/", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create empty cart
            cart = new Cart({ userId });
            await cart.save();
        }

        res.json({ success: true, data: cart });
    } catch (error) {
        console.error("Fetch Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not fetch cart" });
    }
});

/**
 * POST /api/v1/cart/sync
 * Takes the frontend Redux cart state and blindly saves it to DB.
 * Body should match the Cart model structure (items, totals, restaurant tracking).
 */
cartRouter.post("/sync", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, totalQuantity, totalAmount, restaurantId, restaurantName } = req.body;

        // Upsert cart
        let cart = await Cart.findOneAndUpdate(
            { userId },
            { 
                items: items || [], 
                totalQuantity: totalQuantity || 0, 
                totalAmount: totalAmount || 0, 
                restaurantId: restaurantId || null, 
                restaurantName: restaurantName || null
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: cart });
    } catch (error) {
        console.error("Sync Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not sync cart" });
    }
});

/**
 * DELETE /api/v1/cart
 * Empties the cart fully
 */
cartRouter.delete("/", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const emptyCart = {
            items: [],
            totalQuantity: 0,
            totalAmount: 0,
            restaurantId: null,
            restaurantName: null
        };
        const cart = await Cart.findOneAndUpdate(
            { userId },
            emptyCart,
            { new: true, upsert: true }
        );
        res.json({ success: true, data: cart });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ success: false, message: "Could not clear cart" });
    }
});

module.exports = cartRouter;
