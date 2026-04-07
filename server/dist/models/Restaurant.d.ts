import mongoose, { Document } from "mongoose";
export interface IRestaurant extends Document {
    restaurantName: string;
    restaurantAddress: string;
    restaurantCity: string;
    restaurantPincode: string;
    restaurantPhone: string;
    restaurantCuisine: string[];
    restaurantRating: number;
    restaurantTotalRatings: number;
    restaurantDeliveryTime: number;
    restaurantMinOrder: number;
    isRestaurantOpen: boolean;
    restaurantImage: string;
    restaurantDescription: string;
    isRestaurantPromoted: boolean;
    offer: string;
    restaurantTags: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRestaurant, {}, {}, {}, mongoose.Document<unknown, {}, IRestaurant, {}, mongoose.DefaultSchemaOptions> & IRestaurant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRestaurant>;
export default _default;
//# sourceMappingURL=Restaurant.d.ts.map