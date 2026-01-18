const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // Indexed for faster user order history
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true, // Indexed for restaurant analytics
        },
        orderItems: [
            {
                menuItemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: true,
                },
                itemQuantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                itemPrice: {
                    type: Number, // Storing price at time of order is a good practice
                    required: true,
                },
            },
        ],
        orderTotalAmount: {
            type: Number,
            required: true,
            min: 0,
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
            default: "CREATED",
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Order", orderSchema);
