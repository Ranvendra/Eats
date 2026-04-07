import axios from "axios";

// Determine the base URL based on environment
const baseURL = import.meta.env.MODE === "development" 
    ? (import.meta.env.VITE_LOCAL_BACKEND_URL || "http://localhost:5001")
    : import.meta.env.VITE_BACKEND_URL;

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Keep for browsers that support cross-site cookies
});

// Request interceptor: attach JWT from localStorage on every request.
// This is the fix for Safari & Chrome which block third-party cookies
// in cross-domain setups (Vercel frontend → Render backend).
// The server's userAuth middleware reads this header first before falling back to cookies.
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("eats_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
