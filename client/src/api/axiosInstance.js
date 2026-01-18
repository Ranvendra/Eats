import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL, // Backend URL
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
