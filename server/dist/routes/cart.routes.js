"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const userAuth_1 = require("../middlewares/userAuth");
class CartRoutes {
    path = "/api/v1/cart";
    router = (0, express_1.Router)();
    cartController = new cart_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/`, userAuth_1.userAuth, this.cartController.getCart);
        this.router.post(`${this.path}/sync`, userAuth_1.userAuth, this.cartController.syncCart);
        this.router.delete(`${this.path}/`, userAuth_1.userAuth, this.cartController.clearCart);
    }
}
exports.default = CartRoutes;
//# sourceMappingURL=cart.routes.js.map