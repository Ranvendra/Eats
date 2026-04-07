import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

class PaymentController {
  public createOrder = async (req: Request, res: Response) => {
    try {
      const { amount } = req.body; 
      
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ success: false, error: "Razorpay keys missing dynamically." });
      }
      
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      };

      const order = await instance.orders.create(options);
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  };

  public verifyPayment = async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(sign.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true, message: "Payment verified successfully!" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature sent!" });
      }
    } catch (error) {
      console.error("Error verifying signature", error);
      res.status(500).json({ success: false, error: "Server verification error." });
    }
  };
}

export default PaymentController;
