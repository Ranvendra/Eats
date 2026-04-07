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
        const { token } = req.cookies;
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
        res.status(400).json({ message: "ERROR : " + err.message });
    }
};
exports.userAuth = userAuth;
//# sourceMappingURL=userAuth.js.map