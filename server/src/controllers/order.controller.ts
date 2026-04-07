import { Request, Response } from "express";
import Order from "../models/Order";
import MenuItem from "../models/MenuItem";
import Restaurant from "../models/Restaurant";

class OrderController {
  public placeOrder = async (req: Request | any, res: Response) => {
    try {
      const { restaurantId, orderItems, orderTotalAmount, deliveryFee, deliveryAddress } = req.body;

      if (!restaurantId || !orderItems?.length || !orderTotalAmount) {
        return res.status(400).json({ message: "Missing required order fields." });
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found." });
      }

      const enrichedItems = await Promise.all(
        orderItems.map(async (item: any) => {
          const menuItemDoc = await MenuItem.findById(item.menuItemId);
          return {
            menuItemId: item.menuItemId,
            itemName: menuItemDoc?.menuItemName || item.itemName || "Unknown Item",
            itemPrice: item.itemPrice,
            itemQuantity: item.itemQuantity,
            isVeg: menuItemDoc?.isMenuItemVeg ?? item.isVeg ?? true,
          };
        })
      );

      const newOrder = new Order({
        userId: req.user._id,
        restaurantId,
        restaurantName: restaurant.restaurantName,
        orderItems: enrichedItems,
        orderTotalAmount,
        deliveryFee: deliveryFee || 49,
        deliveryAddress: deliveryAddress || req.user.userAddress || "",
        paymentStatus: "PAID",
        orderStatus: "PREPARING",
      });

      const savedOrder = await newOrder.save();

      const populated = await Order.findById(savedOrder._id)
        .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity");

      res.status(201).json({ message: "Order placed successfully!", data: populated });
    } catch (err: any) {
      console.error("Order placement error:", err);
      res.status(500).json({ message: err.message || "Could not place order." });
    }
  };

  public getOrders = async (req: Request | any, res: Response) => {
    try {
      const orders = await Order.find({ userId: req.user._id })
        .populate("restaurantId", "restaurantName restaurantAddress restaurantImage restaurantCity")
        .sort({ createdAt: -1 });

      res.json({ message: "Orders fetched successfully.", data: orders });
    } catch (err) {
      console.error("Order fetch error:", err);
      res.status(500).json({ message: "Could not fetch orders." });
    }
  };

  public updateOrderStatus = async (req: Request | any, res: Response) => {
    try {
      const { orderStatus } = req.body;
      const validStatuses = ["CREATED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: "Invalid order status." });
      }

      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { orderStatus },
        { new: true }
      );

      if (!order) return res.status(404).json({ message: "Order not found." });

      res.json({ message: "Order status updated.", data: order });
    } catch (err) {
      res.status(500).json({ message: "Could not update order status." });
    }
  };
}

export default OrderController;
