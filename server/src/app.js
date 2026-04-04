const express = require("express");
const cors = require("cors");

const app = express();
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.LOCAL_FRONTEND_URL],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const restaurantRouter = require("./routes/restaurantRouter");
const paymentRouter = require("./routes/paymentRouter");
const orderRouter = require("./routes/orderRouter");
const cartRouter = require("./routes/cartRouter");

app.use("/", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);

// Test route
app.get("/", (req, res) => {
    return res.status(200).json({
        service: "Eats App",
        status: "Success",
        message: "Kitchen is open & orders are cooking nicely 🔥",
    });
});

module.exports = app;
