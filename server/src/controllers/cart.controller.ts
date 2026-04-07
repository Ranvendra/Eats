import { Request, Response } from "express";
import Cart from "../models/Cart";

class CartController {
  public getCart = async (req: Request | any, res: Response) => {
    try {
      const userId = req.user._id;
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId });
        await cart.save();
      }

      res.json({ success: true, data: cart });
    } catch (error) {
      console.error("Fetch Cart Error:", error);
      res.status(500).json({ success: false, message: "Could not fetch cart" });
    }
  };

  public syncCart = async (req: Request | any, res: Response) => {
    try {
      const userId = req.user._id;
      const { items, totalQuantity, totalAmount, restaurantId, restaurantName } = req.body;

      let cart = await Cart.findOneAndUpdate(
        { userId },
        { 
          items: items || [], 
          totalQuantity: totalQuantity || 0, 
          totalAmount: totalAmount || 0, 
          restaurantId: restaurantId || null, 
          restaurantName: restaurantName || null
        },
        { new: true, upsert: true }
      );

      res.json({ success: true, data: cart });
    } catch (error) {
      console.error("Sync Cart Error:", error);
      res.status(500).json({ success: false, message: "Could not sync cart" });
    }
  };

  public clearCart = async (req: Request | any, res: Response) => {
    try {
      const userId = req.user._id;
      const emptyCart = {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        restaurantId: null,
        restaurantName: null
      };
      const cart = await Cart.findOneAndUpdate(
        { userId },
        emptyCart,
        { new: true, upsert: true }
      );
      res.json({ success: true, data: cart });
    } catch (error) {
      console.error("Clear Cart Error:", error);
      res.status(500).json({ success: false, message: "Could not clear cart" });
    }
  };
}

export default CartController;
