import { Router } from "express";
import { Routes } from "../utils/route.interface";
import RestaurantController from "../controllers/restaurant.controller";

class RestaurantRoutes implements Routes {
  public path = "/api/v1/restaurants";
  public router = Router();
  public restaurantController = new RestaurantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.restaurantController.getAllRestaurants);
    this.router.get(`${this.path}/:resId`, this.restaurantController.getRestaurantById);
    this.router.get(`${this.path}/:resId/menu`, this.restaurantController.getRestaurantMenu);
  }
}

export default RestaurantRoutes;
