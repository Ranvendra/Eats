"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const userAuth_1 = require("../middlewares/userAuth");
class OrderRoutes {
    path = "/api/v1/orders";
    router = (0, express_1.Router)();
    orderController = new order_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/`, userAuth_1.userAuth, this.orderController.placeOrder);
        this.router.get(`${this.path}/`, userAuth_1.userAuth, this.orderController.getOrders);
        this.router.patch(`${this.path}/:id/status`, userAuth_1.userAuth, this.orderController.updateOrderStatus);
    }
}
exports.default = OrderRoutes;
//# sourceMappingURL=order.routes.js.map