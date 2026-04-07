"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true, minlength: 3, maxlength: 50 },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: { type: String, required: true, minlength: 8 },
    userPhone: { type: String, required: true, unique: true, minlength: 10, maxlength: 15 },
    userAddress: { type: String, default: "" },
    userCity: { type: String, default: "" },
    nickName: { type: String, default: "" },
    gender: { type: String, default: "" },
    country: { type: String, default: "" },
    language: { type: String, default: "" },
    timeZone: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
}, { timestamps: true });
userSchema.pre("save", async function () {
    const user = this;
    if (!user.isModified("password"))
        return;
    try {
        if (user.password) {
            const salt = await bcrypt_1.default.genSalt(10);
            user.password = await bcrypt_1.default.hash(user.password, salt);
        }
    }
    catch (err) {
        throw err;
    }
});
userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const isMatch = await bcrypt_1.default.compare(passwordInput, user.password);
    return isMatch;
};
userSchema.methods.getJWT = function () {
    const user = this;
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, secret, {
        expiresIn: "7d",
    });
    return token;
};
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map