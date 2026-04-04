import axios from "axios";

// Determine the base URL based on environment
const baseURL = import.meta.env.MODE === "development" 
    ? (import.meta.env.VITE_LOCAL_BACKEND_URL || "http://localhost:5001")
    : import.meta.env.VITE_BACKEND_URL;

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
