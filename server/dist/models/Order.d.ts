import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map