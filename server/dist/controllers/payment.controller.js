"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class PaymentController {
    createOrder = async (req, res) => {
        try {
            const { amount } = req.body;
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                return res.status(500).json({ success: false, error: "Razorpay keys missing dynamically." });
            }
            const instance = new razorpay_1.default({
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
        }
        catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ success: false, error: "Failed to create order" });
        }
    };
    verifyPayment = async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");
            if (expectedSignature === razorpay_signature) {
                res.status(200).json({ success: true, message: "Payment verified successfully!" });
            }
            else {
                res.status(400).json({ success: false, error: "Invalid signature sent!" });
            }
        }
        catch (error) {
            console.error("Error verifying signature", error);
            res.status(500).json({ success: false, error: "Server verification error." });
        }
    };
}
exports.default = PaymentController;
//# sourceMappingURL=payment.controller.js.map