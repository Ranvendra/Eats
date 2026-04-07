import axiosInstance from "./axiosInstance";

const TOKEN_KEY = "eats_token";

export const authApi = {
    // Signup API Call
    signup: async (userData) => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/signup", userData);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Signup failed. Please try again.");
        }
    },

    // Login API Call — stores JWT in localStorage for cross-browser support
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/login", credentials);
            const { token } = response.data;
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            }
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Login failed. Please try again.");
        }
    },

    // Logout API Call — removes JWT from localStorage
    logout: async () => {
        try {
            // Remove token first so any in-flight requests don't re-auth
            localStorage.removeItem(TOKEN_KEY);
            const response = await axiosInstance.post("/api/v1/auth/logout");
            return response.data;
        } catch (error) {
            // Even if the server call fails, always clear local token
            localStorage.removeItem(TOKEN_KEY);
            throw error.response?.data || "Logout failed";
        }
    },

    // Get Profile API Call — Authorization header is injected by axiosInstance interceptor
    getProfile: async () => {
        try {
            const response = await axiosInstance.get("/api/v1/auth/profile");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Session expired. Please login again.");
        }
    },

    updateProfile: async (formData) => {
        try {
            // Do NOT manually set Content-Type — axios will auto-set
            // multipart/form-data with the correct boundary when given FormData
            const response = await axiosInstance.put("/api/v1/auth/profile", formData);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message;
            throw new Error(msg || "Could not update profile. Please try again.");
        }
    },
};

