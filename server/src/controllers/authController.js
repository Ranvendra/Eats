const authService = require("../services/authService");
const { validateSignUpData, validateLoginData } = require("../utils/validation");
const { uploadToCloudinary } = require("../config/cloudinary");
const User = require("../models/User");

// Support both NODE_ENV (standard) and isProd (our custom Render env var)
const isProduction = process.env.NODE_ENV === "production" || process.env.isProd === "production";

const handleSignup = async (req, res) => {
    try {
        validateSignUpData(req);

        const { userName, userEmail, password, userPhone } = req.body;
        const user = await authService.signupUser({
            userName,
            userEmail,
            password,
            userPhone,
        });

        // Sanitize user data before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ message: "User added successfully!", data: userResponse });
    } catch (err) {
        // Friendly duplicate field error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const friendly = field === "userEmail" ? "email address" : "phone number";
            return res.status(400).json({ message: `This ${friendly} is already registered. Please login instead.` });
        }
        res.status(400).json({ message: err.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        validateLoginData(req);

        const { identifier, password } = req.body;
        const { user, token } = await authService.loginUser(identifier, password);

        // Sanitize user data
        const userResponse = user.toObject();
        delete userResponse.password;

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,          // HTTPS only in production (Render)
            sameSite: isProduction ? "None" : "Lax", // cross-domain cookies need 'None' in prod
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days (matches JWT expiry)
        });

        res.json({ message: "Login Successful!!", data: userResponse });
    } catch (err) {
        const message = err.message === "Invalid credentials"
            ? "Incorrect email/phone or password. Please try again."
            : err.message;
        res.status(400).json({ message });
    }
};

const handleLogout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        expires: new Date(0), // Immediately expire the cookie
    });
    res.json({ message: "Logout Successful!!" });
};

const handleProfile = async (req, res) => {
    try {
        const user = req.user;
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ message: "Profile fetched successfully", data: userResponse });
    } catch (err) {
        res.status(400).json({ message: "Could not load profile. Please try again." });
    }
};

const handleProfileUpdate = async (req, res) => {
    try {
        const user = req.user;
        const { userName, userPhone, userAddress, userCity, nickName, gender, country, language, timeZone } = req.body;

        // Build only valid updated fields
        const updates = {};
        if (userName && userName.trim()) updates.userName = userName.trim();
        if (userPhone && userPhone.trim()) updates.userPhone = userPhone.trim();
        if (userAddress !== undefined) updates.userAddress = userAddress;
        if (userCity !== undefined) updates.userCity = userCity;
        if (nickName !== undefined) updates.nickName = nickName;
        if (gender !== undefined) updates.gender = gender;
        if (country !== undefined) updates.country = country;
        if (language !== undefined) updates.language = language;
        if (timeZone !== undefined) updates.timeZone = timeZone;

        // Handle profile picture upload via Cloudinary
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.buffer, "eats/profiles");
            updates.profilePicture = imageUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json({ message: "Profile updated successfully!", data: userResponse });
    } catch (err) {
        console.error("Profile update error:", err); // Helps debug Cloudinary issues
        if (err.code === 11000) {
            return res.status(400).json({ message: "That phone number is already in use by another account." });
        }
        res.status(400).json({ message: err.message || "Could not update profile. Please try again." });
    }
};

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
    handleProfile,
    handleProfileUpdate,
};
