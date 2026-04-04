const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { userAuth } = require("../middlewares/userAuth");
const upload = require("../config/multer");

authRouter.post("/signup", authController.handleSignup);
authRouter.post("/login", authController.handleLogin);
authRouter.post("/logout", authController.handleLogout);
authRouter.get("/profile", userAuth, authController.handleProfile);
authRouter.patch("/profile", userAuth, upload.single("profilePicture"), authController.handleProfileUpdate);

module.exports = authRouter;
