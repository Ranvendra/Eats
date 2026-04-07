"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
class OrderController {
    placeOrder = async (req, res) => {
        try {
            const { restaurantId, orderItems, orderTotalAmount, deliveryFee, deliveryAddress } = req.body;
            if (!restaurantId || !orderItems?.length || !orderTotalAmount) {
                return res.status(400).json({ message: "Missing required order fields." });
            }
            const restaurant = await Restaurant_1.default.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found." });
            }
            const enrichedItems = await Promise.all(orderItems.map(async (item) => {
                const menuItemDoc = await MenuItem_1.default.findById(item.menuItemId);
                return {
                    menuItemId: item.menuItemId,
                    itemName: menuItemDoc?.menuItemName || item.itemName || "Unknown Item",
                    itemPrice: item.itemPrice,
                    itemQuantity: item.itemQuantity,
                    isVeg: menuItemDoc?.isMenuItemVeg ?? item.isVeg ?? true,
                };
            }));
            const newOrder = new Order_1.default({
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
            const populated = await Order_1.default.findById(savedOrder._id)
                .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity");
            res.status(201).json({ message: "Order placed successfully!", data: populated });
        }
        catch (err) {
            console.error("Order placement error:", err);
            res.status(500).json({ message: err.message || "Could not place order." });
        }
    };
    getOrders = async (req, res) => {
        try {
            const orders = await Order_1.default.find({ userId: req.user._id })
                .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity")
                .sort({ createdAt: -1 });
            res.json({ message: "Orders fetched successfully.", data: orders });
        }
        catch (err) {
            console.error("Order fetch error:", err);
            res.status(500).json({ message: "Could not fetch orders." });
        }
    };
    updateOrderStatus = async (req, res) => {
        try {
            const { orderStatus } = req.body;
            const validStatuses = ["CREATED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
            if (!validStatuses.includes(orderStatus)) {
                return res.status(400).json({ message: "Invalid order status." });
            }
            const order = await Order_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { orderStatus }, { new: true });
            if (!order)
                return res.status(404).json({ message: "Order not found." });
            res.json({ message: "Order status updated.", data: order });
        }
        catch (err) {
            res.status(500).json({ message: "Could not update order status." });
        }
    };
}
exports.default = OrderController;
//# sourceMappingURL=order.controller.js.map