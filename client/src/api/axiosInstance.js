import axios from "axios";

// Determine the base URL based on environment
const baseURL = import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.MODE === "development" ? "http://localhost:5001" : "/");

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
