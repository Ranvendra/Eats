const express = require("express");
const orderRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

// POST /api/v1/orders — Place a new order after payment success
orderRouter.post("/", userAuth, async (req, res) => {
    try {
        const { restaurantId, orderItems, orderTotalAmount, deliveryFee, deliveryAddress } = req.body;

        if (!restaurantId || !orderItems?.length || !orderTotalAmount) {
            return res.status(400).json({ message: "Missing required order fields." });
        }

        // Fetch restaurant to snapshot name
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        // Build enriched order items — snapshot item name and veg status at order time
        // This ensures historical order accuracy even if menu changes later
        const enrichedItems = await Promise.all(
            orderItems.map(async (item) => {
                // Try to fetch from DB for accuracy, fallback to what frontend sent
                const menuItemDoc = await MenuItem.findById(item.menuItemId);
                return {
                    menuItemId: item.menuItemId,
                    itemName: menuItemDoc?.menuItemName || item.itemName || "Unknown Item",
                    itemPrice: item.itemPrice,
                    itemQuantity: item.itemQuantity,
                    isVeg: menuItemDoc?.isMenuItemVeg ?? item.isVeg ?? true,
                };
            })
        );

        const newOrder = new Order({
            userId: req.user._id,
            restaurantId,
            restaurantName: restaurant.restaurantName,
            orderItems: enrichedItems,
            orderTotalAmount,
            deliveryFee: deliveryFee || 49,
            deliveryAddress: deliveryAddress || req.user.userAddress || "",
            paymentStatus: "PAID",
            orderStatus: "PREPARING",
        });

        const savedOrder = await newOrder.save();

        // Populate for response
        const populated = await Order.findById(savedOrder._id)
            .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity");

        res.status(201).json({ message: "Order placed successfully!", data: populated });
    } catch (err) {
        console.error("Order placement error:", err);
        res.status(500).json({ message: err.message || "Could not place order." });
    }
});

// GET /api/v1/orders — Get all orders for the logged-in user
orderRouter.get("/", userAuth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity")
            .sort({ createdAt: -1 }); // Newest first

        res.json({ message: "Orders fetched successfully.", data: orders });
    } catch (err) {
        console.error("Order fetch error:", err);
        res.status(500).json({ message: "Could not fetch orders." });
    }
});

// PATCH /api/v1/orders/:id/status — Update order status (for admin/future use)
orderRouter.patch("/:id/status", userAuth, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const validStatuses = ["CREATED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { orderStatus },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found." });

        res.json({ message: "Order status updated.", data: order });
    } catch (err) {
        res.status(500).json({ message: "Could not update order status." });
    }
});

module.exports = orderRouter;
