import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  isVeg: boolean;
}

export type OrderStatus = "CREATED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  restaurantName: string;
  orderItems: IOrderItem[];
  orderTotalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    // Snapshot at order time — historical accuracy even if menu changes later
    itemName: { type: String, required: true },
    itemPrice: { type: Number, required: true, min: 0 },
    itemQuantity: { type: Number, required: true, min: 1 },
    isVeg: { type: Boolean, default: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    restaurantName: { type: String, default: "" },
    orderItems: [orderItemSchema],
    orderTotalAmount: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 49 },
    deliveryAddress: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["CREATED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PREPARING",
    },
  },
  { timestamps: true }
);

// Index for efficient user history queries sorted by date
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>("Order", orderSchema);
