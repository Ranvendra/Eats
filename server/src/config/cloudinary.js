const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary and return the secure URL.
 * @param {Buffer} fileBuffer - The raw file buffer from multer memory storage
 * @param {String} folder - The Cloudinary folder to upload into
 * @returns {Promise<String>} Secure URL of the uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = "eats/profiles") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                    { quality: "auto", fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

module.exports = { cloudinary, uploadToCloudinary };
