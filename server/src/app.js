const express = require("express");
const cors = require("cors");

const app = express();
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                "https://eatindia.vercel.app",
                process.env.FRONTEND_URL,
                process.env.LOCAL_FRONTEND_URL
            ];
            
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            // Strip trailing slash if present for strict comparison
            const cleanedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

            // If origin is in our allowed list, explicitly reflect it back.
            // If we don't have it in the list (or if FRONTEND_URL was accidentally set to '*'),
            // we STILL explicitly reflect the origin to prevent the wildcard block error.
            callback(null, origin);
        },
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
