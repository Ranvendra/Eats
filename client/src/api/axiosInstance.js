import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Backend URL
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
