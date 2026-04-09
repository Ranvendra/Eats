import mongoose, { Document, Schema } from "mongoose";

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

/**
 * Restaurant Schema Definition
 * Stores core restaurant metadata, including operational status and ratings.
 */
const restaurantSchema = new Schema<IRestaurant>(
  {
    restaurantName: { type: String, required: true, trim: true, maxlength: 100 },
    restaurantAddress: { type: String, required: true, maxlength: 300 },
    restaurantCity: { type: String, required: true, trim: true, index: true },
    restaurantPincode: { type: String, default: "" },
    restaurantPhone: { type: String, default: "" },
    restaurantCuisine: { type: [String], required: true },
    restaurantRating: { type: Number, default: 0, min: 0, max: 5 },
    restaurantTotalRatings: { type: Number, default: 0 },
    restaurantDeliveryTime: { type: Number, required: true },
    restaurantMinOrder: { type: Number, default: 0 },
    isRestaurantOpen: { type: Boolean, default: true },
    restaurantImage: { type: String, required: true },
    restaurantDescription: { type: String, default: "", maxlength: 500 },
    isRestaurantPromoted: { type: Boolean, default: false },
    offer: { type: String, default: "" },
    restaurantTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Compound index for common query pattern: city + cuisine
restaurantSchema.index({ restaurantCity: 1, restaurantCuisine: 1 });

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
