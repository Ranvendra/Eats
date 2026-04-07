import { Router } from "express";
import { Routes } from "../utils/route.interface";
import OrderController from "../controllers/order.controller";
import { userAuth } from "../middlewares/userAuth";

class OrderRoutes implements Routes {
  public path = "/api/v1/orders";
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, userAuth, this.orderController.placeOrder as any);
    this.router.get(`${this.path}/`, userAuth, this.orderController.getOrders as any);
    this.router.patch(`${this.path}/:id/status`, userAuth, this.orderController.updateOrderStatus as any);
  }
}

export default OrderRoutes;
