import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_LOCAL_BACKEND_URL || "http://localhost:5001", // Correct local dev port
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
