import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  menuItemName: string;
  menuItemPrice: number;
  menuItemCategory: string;
  isMenuItemVeg: boolean;
  isMenuItemAvailable: boolean;
  menuItemImage: string;
  menuItemDescription: string;
  menuItemRating: number;
  menuItemCalories: number | null;
  menuItemServes: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    menuItemName: { type: String, required: true, trim: true, maxlength: 100 },
    menuItemPrice: { type: Number, required: true, min: 0 },
    menuItemCategory: { type: String, required: true, trim: true },
    isMenuItemVeg: { type: Boolean, default: true },
    isMenuItemAvailable: { type: Boolean, default: true },
    menuItemImage: { type: String, default: "" },
    menuItemDescription: { type: String, default: "", maxlength: 200 },
    menuItemRating: { type: Number, default: 0, min: 0, max: 5 },
    menuItemCalories: { type: Number, default: null },
    menuItemServes: { type: String, default: "1" },
  },
  { timestamps: true }
);

// Compound index — fast lookups for "all menu items for restaurant X in category Y"
menuItemSchema.index({ restaurantId: 1, menuItemCategory: 1 });

export default mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
