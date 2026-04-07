import { Router } from "express";
import { Routes } from "../utils/route.interface";
import AuthController from "../controllers/auth.controller";
import { userAuth } from "../middlewares/userAuth";
import upload from "../config/multer";

class AuthRoutes implements Routes {
  public path = "/api/v1/auth";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.handleSignup as any);
    this.router.post(`${this.path}/login`, this.authController.handleLogin as any);
    this.router.post(`${this.path}/logout`, this.authController.handleLogout as any);
    
    this.router.get(`${this.path}/profile`, userAuth, this.authController.handleProfile as any);
    this.router.put(`${this.path}/profile`, userAuth, upload.single("profilePicture"), this.authController.handleProfileUpdate as any);
  }
}

export default AuthRoutes;
