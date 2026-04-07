"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // ← MUST be first so process.env is populated before App reads PORT, MONGO_URI etc.
const app_1 = __importDefault(require("./app"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const restaurant_routes_1 = __importDefault(require("./routes/restaurant.routes"));
const app = new app_1.default([
    new auth_routes_1.default(),
    new cart_routes_1.default(),
    new order_routes_1.default(),
    new payment_routes_1.default(),
    new restaurant_routes_1.default(),
]);
app.startServer();
//# sourceMappingURL=server.js.map