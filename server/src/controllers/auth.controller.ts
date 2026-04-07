import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import User from "../models/User";
import { validateSignUpData, validateLoginData } from "../utils/validation";
import { uploadToCloudinary } from "../config/cloudinary";

const isProduction = process.env.NODE_ENV === "production" || process.env.isProd === "production";

class AuthController {
  private authService = new AuthService();

  public handleSignup = async (req: Request, res: Response) => {
    try {
      validateSignUpData(req);

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
    } catch (err: any) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const friendly = field === "userEmail" ? "email address" : "phone number";
        return res.status(400).json({ message: `This ${friendly} is already registered. Please login instead.` });
      }
      res.status(400).json({ message: err.message });
    }
  };

  public handleLogin = async (req: Request, res: Response) => {
    try {
      validateLoginData(req);

      const { identifier, password } = req.body;
      const { user, token } = await this.authService.loginUser(identifier, password);

      const userResponse = user.toObject();
      delete userResponse.password;

      // Also set cookie as fallback for browsers that support it
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 3600000),
      });

      // Return token in body — client stores in localStorage for cross-domain Safari/Chrome support
      res.json({ message: "Login Successful!!", data: userResponse, token });
    } catch (err: any) {
      const message = err.message === "Invalid credentials"
        ? "Incorrect email/phone or password. Please try again."
        : err.message;
      res.status(400).json({ message });
    }
  };

  public handleLogout = (req: Request, res: Response) => {
    // Clear cookie fallback
    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: new Date(0),
    });
    // Client is also responsible for clearing localStorage token
    res.json({ message: "Logout Successful!!" });
  };

  public handleProfile = async (req: Request | any, res: Response) => {
    try {
      const user = req.user;
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ message: "Profile fetched successfully", data: userResponse });
    } catch (err) {
      res.status(400).json({ message: "Could not load profile. Please try again." });
    }
  };

  public handleProfileUpdate = async (req: Request | any, res: Response) => {
    try {
      const user = req.user;
      const { userName, userPhone, userAddress, userCity, nickName, gender, country, language, timeZone } = req.body;

      const updates: any = {};
      if (userName && userName.trim()) updates.userName = userName.trim();
      if (userPhone && userPhone.trim()) updates.userPhone = userPhone.trim();
      if (userAddress !== undefined) updates.userAddress = userAddress;
      if (userCity !== undefined) updates.userCity = userCity;
      if (nickName !== undefined) updates.nickName = nickName;
      if (gender !== undefined) updates.gender = gender;
      if (country !== undefined) updates.country = country;
      if (language !== undefined) updates.language = language;
      if (timeZone !== undefined) updates.timeZone = timeZone;

      if (req.file) {
        const imageUrl = await uploadToCloudinary(req.file.buffer, "eats/profiles");
        updates.profilePicture = imageUrl;
      }

      const updatedUser: any = await User.findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      const userResponse = updatedUser.toObject();
      delete userResponse.password;

      res.json({ message: "Profile updated successfully!", data: userResponse });
    } catch (err: any) {
      console.error("Profile update error:", err);
      if (err.code === 11000) {
        return res.status(400).json({ message: "That phone number is already in use by another account." });
      }
      res.status(400).json({ message: err.message || "Could not update profile. Please try again." });
    }
  };
}

export default AuthController;
