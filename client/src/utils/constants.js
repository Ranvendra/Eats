export const BASE_URL = import.meta.env.MODE === "development" ? (import.meta.env.VITE_LOCAL_BACKEND_URL || "http://localhost:5001") : import.meta.env.VITE_BACKEND_URL;
