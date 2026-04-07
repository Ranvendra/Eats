# Eats Project Overview

This document provides a comprehensive overview of the **Eats** project, detailing the backend API endpoints and the frontend application structure.

## Backend APIs (Express Routes)

The backend is built with **Node.js, Express, and MongoDB**. The API endpoints are organized into functional routers found in `server/src/routes/`.

### 1. Authentication (`/api/v1/auth`)
*   `POST /signup`: Registers a new user.
*   `POST /login`: Authenticates a user and starts a session.
*   `POST /logout`: Ends the user session.
*   `GET /profile`: Fetches the logged-in user's profile details (protected).
*   `PATCH /profile`: Updates user profile information and profile picture (protected).

### 2. Restaurants (`/api/v1/restaurants`)
*   `GET /`: Retrieves a list of all restaurants.
*   `GET /:resId`: Fetches detailed information for a specific restaurant.
*   `GET /:resId/menu`: Retrieves the menu items for a specific restaurant.

### 3. Cart (`/api/v1/cart`)
*   `GET /`: Fetches the current user's persistent cart from the database.
*   `POST /sync`: Synchronizes the frontend Redux cart state with the database.
*   `DELETE /`: Clears all items from the user's cart.

### 4. Orders (`/api/v1/orders`)
*   `POST /`: Places a new order after successful payment.
*   `GET /`: Retrieves the order history for the logged-in user.
*   `PATCH /:id/status`: Allows updating the status of an order (e.g., "PREPARING" to "DELIVERED").

### 5. Payments (`/api/v1/payments`)
*   `POST /create-order`: Initializes a transaction with Razorpay.
*   `POST /verify-payment`: Verifies the Razorpay payment signature to ensure security.

---

## Frontend Structure (`client/src/`)

The frontend is a **React** application organized into feature-based directories for better maintainability.

### Key Directories & Components

*   **`HomePage/`**: Contains the landing page components like `Hero`, `Navbar`, and `ProfilePopover`.
*   **`Restaurants/`**: Manages restaurant listings, filtering, and the detailed menu view (`RestaurantMenu`).
*   **`Cart/`**: Handles the cart drawer and checkout flow (`DummyCheckout`).
*   **`Orders/`**: Displays user order history and individual order cards.
*   **`Profile/`**: Contains forms and headers for managing user profile information.
*   **`authPage/`**: Dedicated components for Login and Signup screens.
*   **`api/`**: Centralized API configuration:
    *   `axiosInstance.js`: Global Axios setup (base URL, headers).
    *   `authApi.js`: Authentication-related API calls.
*   **`utils/`**: State management and custom hooks:
    *   `appStore.js`: The central Redux store.
    *   `cartSlice.js`, `userSlice.js`, `restaurantSlice.js`: Redux slices for state management.
    *   `useRestaurantMenu.js`: A custom hook to fetch and manage menu data.
*   **`Shimmer/` & `LazyLoading/`**: Components for improving user experience during data fetching (loading states and image lazy loading).
*   **`Animations/`**: Contains visual feedback components like `OrderSuccess`.
*   **`Toast/`**: Global notification system (`ToastContext`).

### Main Entry Points
*   **`App.jsx`**: The root component defining global routing, Redux Provider, and application-wide layout.
*   **`main.jsx`**: The entry point that renders the React application into the DOM.
