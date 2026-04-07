"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Upload a file buffer to Cloudinary and return the secure URL.
 * @param fileBuffer - The raw file buffer from multer memory storage
 * @param folder - The Cloudinary folder to upload into
 * @returns Secure URL of the uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = "eats/profiles") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
            ],
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result.secure_url);
        });
        streamifier_1.default.createReadStream(fileBuffer).pipe(stream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=cloudinary.js.map