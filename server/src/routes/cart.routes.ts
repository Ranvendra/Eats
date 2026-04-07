import { Router } from "express";
import { Routes } from "../utils/route.interface";
import CartController from "../controllers/cart.controller";
import { userAuth } from "../middlewares/userAuth";

class CartRoutes implements Routes {
  public path = "/api/v1/cart";
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, userAuth, this.cartController.getCart as any);
    this.router.post(`${this.path}/sync`, userAuth, this.cartController.syncCart as any);
    this.router.delete(`${this.path}/`, userAuth, this.cartController.clearCart as any);
  }
}

export default CartRoutes;
