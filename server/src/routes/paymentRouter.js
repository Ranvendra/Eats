const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const paymentRouter = express.Router();

// Route to initialize a transaction
paymentRouter.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, error: "Razorpay keys missing dynamically." });
        }
        
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, error: "Failed to create order" });
    }
});

// Route to verify the payment signature from Frontend
paymentRouter.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment verified properly
            res.status(200).json({ success: true, message: "Payment verified successfully!" });
        } else {
            res.status(400).json({ success: false, error: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error("Error verifying signature", error);
        res.status(500).json({ success: false, error: "Server verification error." });
    }
});

module.exports = paymentRouter;
