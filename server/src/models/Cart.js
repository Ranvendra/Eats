const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
    },
    menuItemName: {
        type: String,
        required: true,
    },
    menuItemPrice: {
        type: Number,
        required: true,
    },
    itemQuantity: {
        type: Number,
        required: true,
        min: 1,
    },
    menuItemImage: {
        type: String,
        default: "",
    },
    isMenuItemVeg: {
        type: Boolean,
        default: true,
    },
}, { _id: false }); // No _id for subdocuments needed here

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            default: null,
        },
        restaurantName: {
            type: String,
            default: null,
        },
        items: [cartItemSchema],
        totalQuantity: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
