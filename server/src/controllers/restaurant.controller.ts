import { Request, Response } from "express";
import mongoose from "mongoose";
// Make sure to convert Restaurant to TS model next, or just import like this for now
import Restaurant from "../models/Restaurant";
import MenuItem from "../models/MenuItem";

class RestaurantController {
  /**
   * Fetches a paginated list of all restaurants.
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public getAllRestaurants = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const startIndex = (page - 1) * limit;
      const total = await Restaurant.countDocuments({});

      const restaurants = await Restaurant.find({}).skip(startIndex).limit(limit);

      res.status(200).json({
        data: restaurants,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: "Error fetching restaurants", error: err.message });
    }
  };

  /**
   * Fetches details for a single restaurant by its ID.
   * @param req - Express Request object (expects resId in params)
   * @param res - Express Response object
   */
  public getRestaurantById = async (req: Request, res: Response) => {
    try {
      const resId = req.params.resId as string;

      if (!mongoose.Types.ObjectId.isValid(resId)) {
        console.log("Invalid ID format");
        return res.status(400).json({ message: "Invalid Restaurant ID" });
      }

      const restaurant = await Restaurant.findById(resId);

      if (!restaurant) {
        console.log("Restaurant not found in DB");
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json(restaurant);
    } catch (error: any) {
      console.error("Error in getRestaurantById:", error);
      res.status(500).json({ message: "Error fetching restaurant details", error: error.message });
    }
  };

  /**
   * Fetches the menu items for a specific restaurant.
   * @param req - Express Request object (expects resId in params)
   * @param res - Express Response object
   */
  public getRestaurantMenu = async (req: Request, res: Response) => {
    try {
      const resId = req.params.resId as string;

      if (!mongoose.Types.ObjectId.isValid(resId)) {
        console.log("Invalid ID format for menu");
        return res.status(400).json({ message: "Invalid Restaurant ID" });
      }

      const restaurant = await Restaurant.findById(resId);
      if (!restaurant) {
        console.log("Restaurant not found for menu fetch");
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const menuItems = await MenuItem.find({ restaurantId: resId });

      res.status(200).json(menuItems);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching menu items", error: error.message });
    }
  };
}

export default RestaurantController;
