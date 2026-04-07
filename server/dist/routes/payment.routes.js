"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const userAuth_1 = require("../middlewares/userAuth");
class PaymentRoutes {
    path = "/api/v1/payment";
    router = (0, express_1.Router)();
    paymentController = new payment_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create-order`, userAuth_1.userAuth, this.paymentController.createOrder);
        this.router.post(`${this.path}/verify-payment`, userAuth_1.userAuth, this.paymentController.verifyPayment);
    }
}
exports.default = PaymentRoutes;
//# sourceMappingURL=payment.routes.js.map