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

app.use("/", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);

// Test route
app.get("/", (req, res) => {
    return res.status(200).json({
        service: "Eats App",
        status: "Success",
        message: "Kitchen is open & orders are cooking nicely 🔥",
    });
});

module.exports = app;
