"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginData = exports.validateSignUpData = void 0;
const validator_1 = __importDefault(require("validator"));
const validateSignUpData = (req) => {
    const { userName, userEmail, password, userPhone } = req.body;
    if (!userName || !userEmail || !password || !userPhone) {
        throw new Error("All fields are required");
    }
    else if (!validator_1.default.isEmail(userEmail)) {
        throw new Error("Email ID is not valid");
    }
    else if (!validator_1.default.isStrongPassword(password)) {
        throw new Error("Password must be strong (min 8 chars, 1 lowercase, 1 uppercase, 1 symbol)");
    }
};
exports.validateSignUpData = validateSignUpData;
const validateLoginData = (req) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        throw new Error("All fields are required");
    }
    const isEmail = validator_1.default.isEmail(identifier);
    const isPhone = validator_1.default.isMobilePhone(identifier, "any", { strictMode: false });
    if (!isEmail && !isPhone) {
        throw new Error("Please enter a valid Email or Phone Number");
    }
};
exports.validateLoginData = validateLoginData;
//# sourceMappingURL=validation.js.map