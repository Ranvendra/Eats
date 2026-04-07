import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IMenuItem, {}, {}, {}, mongoose.Document<unknown, {}, IMenuItem, {}, mongoose.DefaultSchemaOptions> & IMenuItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMenuItem>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map