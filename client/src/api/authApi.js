import axiosInstance from "./axiosInstance";

export const authApi = {
    // Signup API Call
    signup: async (userData) => {
        try {
            const response = await axiosInstance.post("/signup", userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Signup failed";
        }
    },

    // Login API Call
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post("/login", credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Login failed";
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
            throw error.response?.data || "Failed to fetch profile";
        }
    },
};
