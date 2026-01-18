const express = require("express");
const cors = require("cors");

const app = express();
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

// Test route
app.get("/", (req, res) => {
    return res.status(200).json({
        service: "Eats App",
        status: "Success",
        message: "Kitchen is open & orders are cooking nicely 🔥",
    });
});

module.exports = app;
