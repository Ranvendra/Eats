"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class AuthService {
    async signupUser(userData) {
        const { userName, userEmail, password, userPhone } = userData;
        const user = new User_1.default({
            userName,
            userEmail,
            password,
            userPhone,
        });
        const savedUser = await user.save();
        return savedUser;
    }
    async loginUser(identifier, passwordInput) {
        if (!identifier || !passwordInput) {
            throw new Error("Invalid credentials");
        }
        const user = await User_1.default.findOne({
            $or: [{ userEmail: identifier }, { userPhone: identifier }],
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(passwordInput);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = await user.getJWT();
        return { user, token };
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map