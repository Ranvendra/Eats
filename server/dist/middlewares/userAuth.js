"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const userAuth = async (req, res, next) => {
    try {
        // Primary: Authorization header (works in ALL browsers cross-domain — Safari, Chrome, etc.)
        // Fallback: Cookie (for browsers that still support it)
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        else {
            token = req.cookies?.token;
        }
        if (!token) {
            throw new Error("Please Login");
        }
        const decodedMessage = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedMessage;
        const user = await User_1.default.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
exports.userAuth = userAuth;
//# sourceMappingURL=userAuth.js.map