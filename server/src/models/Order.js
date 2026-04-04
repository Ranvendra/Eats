const mongoose = require("mongoose");

// Explicit sub-schema for order items — enables clean populate and future item-level ops
const orderItemSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        // Snapshot the name and price at order time so historical orders are always accurate
        // even if the restaurant later changes the menu
        itemName: {
            type: String,
            required: true,
        },
        itemPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        itemQuantity: {
            type: Number,
            required: true,
            min: 1,
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false } // no separate _id per item — keeps documents leaner
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true,
        },
        // Snapshot the restaurant name at order time
        restaurantName: {
            type: String,
            default: "",
        },
        orderItems: [orderItemSchema],
        orderTotalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        deliveryFee: {
            type: Number,
            default: 49,
        },
        deliveryAddress: {
            type: String,
            default: "",
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },
        orderStatus: {
            type: String,
            enum: [
                "CREATED",
                "ACCEPTED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PREPARING",
        },
    },
    {
        timestamps: true, // createdAt + updatedAt — use createdAt as the order time
    }
);

// Index for efficient user history queries sorted by date
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
