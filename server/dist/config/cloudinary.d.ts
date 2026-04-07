import { v2 as cloudinary } from "cloudinary";
/**
 * Upload a file buffer to Cloudinary and return the secure URL.
 * @param fileBuffer - The raw file buffer from multer memory storage
 * @param folder - The Cloudinary folder to upload into
 * @returns Secure URL of the uploaded image
 */
export declare const uploadToCloudinary: (fileBuffer: Buffer, folder?: string) => Promise<string>;
export { cloudinary };
//# sourceMappingURL=cloudinary.d.ts.map