"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = __importDefault(require("../controllers/restaurant.controller"));
class RestaurantRoutes {
    path = "/api/v1/restaurants";
    router = (0, express_1.Router)();
    restaurantController = new restaurant_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/`, this.restaurantController.getAllRestaurants);
        this.router.get(`${this.path}/:resId`, this.restaurantController.getRestaurantById);
        this.router.get(`${this.path}/:resId/menu`, this.restaurantController.getRestaurantMenu);
    }
}
exports.default = RestaurantRoutes;
//# sourceMappingURL=restaurant.routes.js.map