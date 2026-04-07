"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const userAuth_1 = require("../middlewares/userAuth");
const multer_1 = __importDefault(require("../config/multer"));
class AuthRoutes {
    path = "/api/v1/auth";
    router = (0, express_1.Router)();
    authController = new auth_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/signup`, this.authController.handleSignup);
        this.router.post(`${this.path}/login`, this.authController.handleLogin);
        this.router.post(`${this.path}/logout`, this.authController.handleLogout);
        this.router.get(`${this.path}/profile`, userAuth_1.userAuth, this.authController.handleProfile);
        this.router.put(`${this.path}/profile`, userAuth_1.userAuth, multer_1.default.single("profilePicture"), this.authController.handleProfileUpdate);
    }
}
exports.default = AuthRoutes;
//# sourceMappingURL=auth.routes.js.map