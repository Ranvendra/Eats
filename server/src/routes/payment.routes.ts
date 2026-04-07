import { Router } from "express";
import { Routes } from "../utils/route.interface";
import PaymentController from "../controllers/payment.controller";
import { userAuth } from "../middlewares/userAuth";

class PaymentRoutes implements Routes {
  public path = "/api/v1/payment";
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-order`, userAuth, this.paymentController.createOrder);
    this.router.post(`${this.path}/verify-payment`, userAuth, this.paymentController.verifyPayment);
  }
}

export default PaymentRoutes;
