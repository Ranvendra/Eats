import axiosInstance from "./axiosInstance";

export const authApi = {
    // Signup API Call
    signup: async (userData) => {
        try {
            const response = await axiosInstance.post("/signup", userData);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Signup failed. Please try again.");
        }
    },

    // Login API Call
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post("/login", credentials);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Login failed. Please try again.");
        }
    },

    // Logout API Call
    logout: async () => {
        try {
            const response = await axiosInstance.post("/logout");
            return response.data;
        } catch (error) {
            throw error.response?.data || "Logout failed";
        }
    },

    // Get Profile API Call
    getProfile: async () => {
        try {
            const response = await axiosInstance.get("/profile");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Session expired. Please login again.");
        }
    },

    updateProfile: async (formData) => {
        try {
            // Do NOT manually set Content-Type — axios will auto-set
            // multipart/form-data with the correct boundary when given FormData
            const response = await axiosInstance.patch("/profile", formData);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Could not update profile. Please try again.");
        }
    },
};
