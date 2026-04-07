import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  menuItemId: mongoose.Types.ObjectId;
  menuItemName: string;
  menuItemPrice: number;
  itemQuantity: number;
  menuItemImage: string;
  isMenuItemVeg: boolean;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId | null;
  restaurantName: string | null;
  items: ICartItem[];
  totalQuantity: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    menuItemName: { type: String, required: true },
    menuItemPrice: { type: Number, required: true },
    itemQuantity: { type: Number, required: true, min: 1 },
    menuItemImage: { type: String, default: "" },
    isMenuItemVeg: { type: Boolean, default: true },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },
    restaurantName: { type: String, default: null },
    items: [cartItemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);
