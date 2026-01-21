import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useRestaurantMenu = (resId) => {
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Using Promise.all to fetch both restaurant details and menu items
                const [resResponse, menuResponse] = await Promise.all([
                    axiosInstance.get(`/api/v1/restaurants/${resId}`),
                    axiosInstance.get(`/api/v1/restaurants/${resId}/menu`)
                ]);

                setRestaurant(resResponse.data);
                setMenuItems(menuResponse.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (resId) {
            fetchData();
        }
    }, [resId]);

    return { restaurant, menuItems, loading, error };
};

export default useRestaurantMenu;
