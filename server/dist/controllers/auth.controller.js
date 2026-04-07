"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const User_1 = __importDefault(require("../models/User"));
const validation_1 = require("../utils/validation");
const cloudinary_1 = require("../config/cloudinary");
const isProduction = process.env.NODE_ENV === "production" || process.env.isProd === "production";
class AuthController {
    authService = new auth_service_1.default();
    handleSignup = async (req, res) => {
        try {
            (0, validation_1.validateSignUpData)(req);
            const { userName, userEmail, password, userPhone } = req.body;
            const user = await this.authService.signupUser({
                userName,
                userEmail,
                password,
                userPhone,
            });
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json({ message: "User added successfully!", data: userResponse });
        }
        catch (err) {
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                const friendly = field === "userEmail" ? "email address" : "phone number";
                return res.status(400).json({ message: `This ${friendly} is already registered. Please login instead.` });
            }
            res.status(400).json({ message: err.message });
        }
    };
    handleLogin = async (req, res) => {
        try {
            (0, validation_1.validateLoginData)(req);
            const { identifier, password } = req.body;
            const { user, token } = await this.authService.loginUser(identifier, password);
            const userResponse = user.toObject();
            delete userResponse.password;
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                expires: new Date(Date.now() + 7 * 24 * 3600000),
            });
            res.json({ message: "Login Successful!!", data: userResponse });
        }
        catch (err) {
            const message = err.message === "Invalid credentials"
                ? "Incorrect email/phone or password. Please try again."
                : err.message;
            res.status(400).json({ message });
        }
    };
    handleLogout = (req, res) => {
        res.cookie("token", "", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            expires: new Date(0),
        });
        res.json({ message: "Logout Successful!!" });
    };
    handleProfile = async (req, res) => {
        try {
            const user = req.user;
            const userResponse = user.toObject();
            delete userResponse.password;
            res.json({ message: "Profile fetched successfully", data: userResponse });
        }
        catch (err) {
            res.status(400).json({ message: "Could not load profile. Please try again." });
        }
    };
    handleProfileUpdate = async (req, res) => {
        try {
            const user = req.user;
            const { userName, userPhone, userAddress, userCity, nickName, gender, country, language, timeZone } = req.body;
            const updates = {};
            if (userName && userName.trim())
                updates.userName = userName.trim();
            if (userPhone && userPhone.trim())
                updates.userPhone = userPhone.trim();
            if (userAddress !== undefined)
                updates.userAddress = userAddress;
            if (userCity !== undefined)
                updates.userCity = userCity;
            if (nickName !== undefined)
                updates.nickName = nickName;
            if (gender !== undefined)
                updates.gender = gender;
            if (country !== undefined)
                updates.country = country;
            if (language !== undefined)
                updates.language = language;
            if (timeZone !== undefined)
                updates.timeZone = timeZone;
            if (req.file) {
                const imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "eats/profiles");
                updates.profilePicture = imageUrl;
            }
            const updatedUser = await User_1.default.findByIdAndUpdate(user._id, { $set: updates }, { new: true, runValidators: true });
            const userResponse = updatedUser.toObject();
            delete userResponse.password;
            res.json({ message: "Profile updated successfully!", data: userResponse });
        }
        catch (err) {
            console.error("Profile update error:", err);
            if (err.code === 11000) {
                return res.status(400).json({ message: "That phone number is already in use by another account." });
            }
            res.status(400).json({ message: err.message || "Could not update profile. Please try again." });
        }
    };
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map