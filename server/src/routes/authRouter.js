const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.post("/signup", authController.handleSignup);
authRouter.post("/login", authController.handleLogin);

module.exports = authRouter;
