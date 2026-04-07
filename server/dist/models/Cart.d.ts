import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICart>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map