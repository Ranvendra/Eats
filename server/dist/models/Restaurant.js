"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const restaurantSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Compound index for common query pattern: city + cuisine
restaurantSchema.index({ restaurantCity: 1, restaurantCuisine: 1 });
exports.default = mongoose_1.default.model("Restaurant", restaurantSchema);
//# sourceMappingURL=Restaurant.js.map