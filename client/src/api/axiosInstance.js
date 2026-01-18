import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:5001", // Backend URL
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
