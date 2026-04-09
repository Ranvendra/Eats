# 🍔 Eats — Full Stack Food Delivery Application

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

Eats is a premium full stack food delivery application that allows users to browse restaurants, explore menus, add items to a cart, make payments, and track orders. 

> [!TIP]
> This project is built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and features a production-ready **TypeScript** backend with a class-based architecture.

---

## 📖 Table of Contents

1. [Live Demo](#live-demo)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Architecture](#project-architecture)
5. [Project Structure](#project-structure)
6. [Database Models](#database-models)
7. [API Reference](#api-reference)
8. [Frontend Pages and Components](#frontend-pages-and-components)
9. [Key Data Flows](#key-data-flows)
10. [Authentication Design](#authentication-design)
11. [Local Development Setup](#local-development-setup)
12. [Environment Variables](#environment-variables)
13. [Deployment](#deployment)
14. [Known Limitations](#known-limitations)
15. [License](#license)

---

<a name="live-demo"></a>
## 🚀 Live Demo

| Service    | URL                                      |
|------------|------------------------------------------|
| Frontend   | https://eatindia.vercel.app              |

The frontend is deployed on Vercel. The backend API is deployed on Render.

---

<a name="features"></a>
## ✨ Features

**User Authentication**
Users can create an account using their name, email, phone number, and password. They can log in using either their email address or phone number. Session management uses JSON Web Tokens stored in the browser's local storage. Authentication works consistently across Chrome, Safari, Firefox, Arc, and all other modern browsers.

**Restaurant Discovery**
Users can browse all available restaurants with pagination support (20 restaurants per page). The restaurant listing page supports client-side filtering by restaurant name, cuisine type, minimum rating, and veg or non-veg preference. Results can be sorted by rating, delivery time, and cost.

**Restaurant Menu**
Each restaurant has a detailed menu page showing all available food items grouped by category. A sidebar allows users to jump to a specific category. Each menu item card shows the item name, price, description, veg or non-veg indicator, calorie count, and serving size.

**Cart Management**
Users can add items from a restaurant menu to their cart. A confirmation step prevents accidental additions. The cart persists across sessions by automatically syncing with the MongoDB database after every change using a 1-second debounce. The cart is scoped to one restaurant at a time. Adding items from a new restaurant replaces the previous cart.

**Order Placement and History**
After checkout, an order is saved to the database with a full snapshot of the items, prices, and restaurant details at the time of ordering. The order history page classifies orders as active (placed within the last minute, with a live countdown timer) or past. Past orders display detailed information with hover animations.

**Payment**
A Razorpay-styled checkout interface is presented during the payment step. It includes four payment method tabs: Cards, UPI, Netbanking, and Wallets — each with a realistic user interface. Payment processing is simulated with a 2-second delay before the order is confirmed and saved to the database.

**Profile Management**
Logged-in users can view and edit their profile including their username, nickname, gender, country, language, and timezone. Profile pictures can be uploaded and are stored on Cloudinary. Changes are saved to the database and reflected globally in the Redux store.

**Image Handling**
Profile pictures are uploaded as a stream directly to Cloudinary without writing any temporary file to disk. Restaurant and menu item images are served via Cloudinary URLs. Lazy loading is applied to all images using IntersectionObserver so images only load when they are visible on the screen.

---

<a name="technology-stack"></a>
## 🛠️ Technology Stack

### Backend

| Technology       | Version   | Purpose                                          |
|------------------|-----------|--------------------------------------------------|
| Node.js          | LTS       | JavaScript runtime environment                   |
| Express.js       | 5.x       | HTTP server and routing framework                |
| TypeScript       | 6.x       | Type-safe JavaScript with OOP architecture       |
| MongoDB          | Cloud     | Primary NoSQL database                           |
| Mongoose         | 9.x       | MongoDB object modeling and schema definitions   |
| JSON Web Token   | 9.x       | Stateless user authentication tokens             |
| Bcrypt           | 6.x       | Secure password hashing                          |
| Cloudinary       | 2.x       | Image upload, storage, and transformation        |
| Multer           | 2.x       | File upload middleware (memory storage)          |
| Streamifier      | 0.1.x     | Converts file buffer to stream for Cloudinary    |
| Razorpay         | 2.x       | Payment order creation and signature verification|
| Cookie-parser    | 1.x       | Parsing HTTP cookies from incoming requests      |
| CORS             | 2.x       | Cross-origin resource sharing configuration      |
| Validator.js     | 13.x      | Input validation (email format, password rules)  |
| Dotenv           | 17.x      | Loading environment variables from .env files    |

### Frontend

| Technology          | Version   | Purpose                                          |
|---------------------|-----------|--------------------------------------------------|
| React               | 19.x      | UI component library                             |
| Vite                | 7.x       | Development server and production build tool     |
| React Router DOM    | 7.x       | Client-side page routing                         |
| Redux Toolkit       | 2.x       | Global state management                          |
| React Redux         | 9.x       | React bindings for the Redux store               |
| Axios               | 1.x       | HTTP client for API requests                     |
| Tailwind CSS        | 4.x       | Utility-first CSS framework                      |
| Framer Motion       | 12.x      | Animations and transitions                       |
| Lucide React        | 0.5x      | Icon library                                     |

---

<a name="project-architecture"></a>
## 🏗️ Project Architecture

### Backend Architecture

The backend follows a strict class-based Object-Oriented architecture with five distinct layers. Each layer has a single, well-defined responsibility.

```
server.ts
  |
  +--> new App([routes...])
         |
         +--> App class
               |
               +--> initializeMiddlewares()   (CORS, JSON parsing, cookie parsing)
               +--> initializeRoutes()         (mounts all route class routers)
               +--> connectDatabase()          (MongoDB connection)
               +--> startServer()              (opens the HTTP port)
                     |
                     +--> AuthRoutes     implements Routes interface
                     +--> CartRoutes     implements Routes interface
                     +--> OrderRoutes    implements Routes interface
                     +--> PaymentRoutes  implements Routes interface
                     +--> RestaurantRoutes implements Routes interface
                           |
                           +--> Controller class (handles HTTP request and response)
                                 |
                                 +--> Service class (handles business logic and database queries)
```

Every route class implements a shared `Routes` interface defined in `utils/route.interface.ts`. This interface guarantees that every route class exposes a `router` property, which allows the `App` class to mount them all in the same consistent way without knowing what each route does internally.

This architecture is commonly seen in enterprise-grade frameworks like NestJS. It makes the codebase easy to navigate, extend, and test independently.

### Frontend Architecture

The frontend is a React Single Page Application. The application is wrapped in a Redux Provider and a React Router BrowserRouter at the top level. The entire application has one central Redux store with three slices: one for user authentication state, one for the cart, and one for the restaurant list.

A critical "hydration" pattern runs on every page load. When the application first mounts, it checks whether a valid JWT token exists in the browser's local storage and silently contacts the backend to restore the user's session and cart without requiring the user to log in again.

---

<a name="project-structure"></a>
## 📂 Project Structure

```
Eats/
|
+-- client/                          Frontend React application
|   +-- public/
|   +-- src/
|       +-- About/                   Static marketing pages
|       |   +-- About.jsx
|       |   +-- AboutFooter.jsx
|       |   +-- AboutHero.jsx
|       |   +-- OurStory.jsx
|       |   +-- Stats.jsx
|       |
|       +-- Animations/
|       |   +-- OrderSuccess.jsx     Success animation shown after order placement
|       |
|       +-- api/
|       |   +-- axiosInstance.js     Axios setup — base URL, credentials, auth header interceptor
|       |   +-- authApi.js           Authentication API calls — login, signup, logout, profile
|       |
|       +-- authPage/
|       |   +-- AuthSidebar.jsx      Slide-in drawer containing the login and signup views
|       |   +-- Login.jsx            Login form
|       |   +-- Signup.jsx           Signup form
|       |
|       +-- Cart/
|       |   +-- CartDrawer.jsx       Slide-in cart panel with item list, quantity controls, totals
|       |   +-- DummyCheckout.jsx    Razorpay-styled payment modal with four payment method tabs
|       |
|       +-- HomePage/
|       |   +-- Hero.jsx             Landing page hero section
|       |   +-- Home.jsx             Page wrapper for Navbar and Hero
|       |   +-- Navbar.jsx           Top navigation with auth controls and cart badge
|       |   +-- ProfilePopover.jsx   Dropdown menu shown when the user is authenticated
|       |
|       +-- LazyLoading/
|       |   +-- LazyImage.jsx        Lazy image loading using IntersectionObserver
|       |
|       +-- Orders/
|       |   +-- OrderCard.jsx        Card component for individual orders
|       |   +-- OrderHero.jsx        Hero section of the Orders page
|       |   +-- OrderHistory.jsx     Full order history component with active and past sections
|       |   +-- OrderItem.jsx        Individual order item display
|       |   +-- Orders.jsx           Page wrapper that checks authentication before rendering
|       |
|       +-- Profile/
|       |   +-- Profile.jsx          Auth-guarded page with profile edit and save flow
|       |   +-- ProfileEmails.jsx    Read-only email display section
|       |   +-- ProfileForm.jsx      Editable personal information form fields
|       |   +-- ProfileHeader.jsx    Avatar display with edit and save buttons
|       |
|       +-- Restaurants/
|       |   +-- MenuItems/
|       |   |   +-- CategorySidebar.jsx      Sidebar for jumping to a menu category
|       |   |   +-- MenuItemCard.jsx         Menu item card with two-step add-to-cart flow
|       |   |   +-- RestaurantMenuLayout.jsx Layout wrapper for category sidebar and item list
|       |   |
|       |   +-- PaginationControls.jsx       Page number navigation for restaurant listing
|       |   +-- RestaurantCard.jsx           Summary card shown in the restaurant listing
|       |   +-- RestaurantFilters.jsx        Filter panel with search, cuisine, rating, and sort
|       |   +-- RestaurantMenu.jsx           Page that fetches and displays a restaurant's menu
|       |   +-- Restaurants.jsx              Main restaurant listing page with filtering and pagination
|       |
|       +-- Shimmer/
|       |   +-- MenuShimmer.jsx      Skeleton loading placeholder for menu items
|       |
|       +-- Toast/
|       |   +-- Toast.jsx            Visual notification component (success and error variants)
|       |   +-- ToastContext.jsx      React context that provides the addToast function globally
|       |
|       +-- utils/
|           +-- appStore.js          The central Redux store with the cart auto-sync subscriber
|           +-- cartSlice.js         Redux slice for cart state
|           +-- constants.js         Shared application constants
|           +-- restaurantSlice.js   Redux slice for the restaurant list
|           +-- useRestaurantMenu.js Custom hook to fetch and manage restaurant menu data
|           +-- userSlice.js         Redux slice for user authentication state
|
+-- server/                          Backend Express API
|   +-- dist/                        Pre-compiled JavaScript (generated by tsc — do not edit manually)
|   +-- src/
|       +-- config/
|       |   +-- cloudinary.ts        Cloudinary SDK setup and the uploadToCloudinary helper function
|       |   +-- multer.ts            Multer middleware — memory storage, 5 MB limit, images only
|       |
|       +-- controllers/
|       |   +-- auth.controller.ts       Handles signup, login, logout, get profile, update profile
|       |   +-- cart.controller.ts       Handles get cart, sync cart, clear cart
|       |   +-- order.controller.ts      Handles place order, get orders, update order status
|       |   +-- payment.controller.ts    Handles Razorpay order creation and payment verification
|       |   +-- restaurant.controller.ts Handles get all restaurants, get by ID, get menu
|       |
|       +-- middlewares/
|       |   +-- userAuth.ts          Verifies the JWT token from the Authorization header or cookie
|       |
|       +-- models/
|       |   +-- Cart.ts              Mongoose schema for the user cart document
|       |   +-- MenuItem.ts          Mongoose schema for a menu item
|       |   +-- Order.ts             Mongoose schema for a placed order
|       |   +-- Restaurant.ts        Mongoose schema for a restaurant
|       |   +-- User.ts              Mongoose schema for a user account
|       |
|       +-- routes/
|       |   +-- auth.routes.ts       Defines all /api/v1/auth route paths and connects middleware
|       |   +-- cart.routes.ts       Defines all /api/v1/cart route paths
|       |   +-- order.routes.ts      Defines all /api/v1/orders route paths
|       |   +-- payment.routes.ts    Defines all /api/v1/payment route paths
|       |   +-- restaurant.routes.ts Defines all /api/v1/restaurants route paths
|       |
|       +-- services/
|       |   +-- auth.service.ts      Business logic for user creation and login validation
|       |
|       +-- utils/
|           +-- route.interface.ts   Shared Routes interface that all route classes implement
|           +-- validation.ts        Input validation functions for signup and login data
|
|       +-- app.ts                   The App class — bootstraps Express, middleware, routes, and DB
|       +-- server.ts                Entry point — instantiates App with all route classes
|
+-- menuItem.json                    Seed data file for loading initial menu items
+-- restaurants.json                 Seed data file for loading initial restaurant data
+-- Development_journey_errors.md    Detailed record of every major bug encountered and how it was solved
+-- project_overview.md              Summary of backend API endpoints and frontend component structure
+-- README.md                        This file
```

---

<a name="database-models"></a>
## 🗄️ Database Models

All data is stored in MongoDB Atlas. The following sections describe each collection and its fields.

### User

Stores registered user accounts.

| Field            | Type    | Rules                                                |
|------------------|---------|------------------------------------------------------|
| userName         | String  | Required. Between 3 and 50 characters.              |
| userEmail        | String  | Required. Must be unique. Validated as email format. |
| password         | String  | Required. Minimum 8 characters. Stored as bcrypt hash. |
| userPhone        | String  | Required. Must be unique. Between 10 and 15 digits. |
| userAddress      | String  | Optional. Defaults to empty string.                 |
| userCity         | String  | Optional. Defaults to empty string.                 |
| nickName         | String  | Optional. Defaults to empty string.                 |
| gender           | String  | Optional. Defaults to empty string.                 |
| country          | String  | Optional. Defaults to empty string.                 |
| language         | String  | Optional. Defaults to empty string.                 |
| timeZone         | String  | Optional. Defaults to empty string.                 |
| profilePicture   | String  | Cloudinary URL. Defaults to empty string.           |
| createdAt        | Date    | Automatically set by Mongoose timestamps.           |
| updatedAt        | Date    | Automatically updated by Mongoose timestamps.       |

The password is hashed automatically before every save using a Mongoose pre-save hook. The model also provides two instance methods: `validatePassword(input)` which checks a plain text password against the stored hash, and `getJWT()` which generates a signed JWT token for the user.

### Restaurant

Stores restaurant information.

| Field                     | Type     | Rules                                         |
|---------------------------|----------|-----------------------------------------------|
| restaurantName            | String   | Required. Up to 100 characters.               |
| restaurantAddress         | String   | Required. Up to 300 characters.               |
| restaurantCity            | String   | Required. Indexed for fast city-based queries.|
| restaurantPincode         | String   | Optional.                                     |
| restaurantPhone           | String   | Optional.                                     |
| restaurantCuisine         | String[] | Required array of cuisine type strings.       |
| restaurantRating          | Number   | Between 0 and 5. Defaults to 0.              |
| restaurantTotalRatings    | Number   | Defaults to 0.                                |
| restaurantDeliveryTime    | Number   | Required. Time in minutes.                    |
| restaurantMinOrder        | Number   | Minimum order amount. Defaults to 0.          |
| isRestaurantOpen          | Boolean  | Defaults to true.                             |
| restaurantImage           | String   | Required. Cloudinary URL.                     |
| restaurantDescription     | String   | Optional. Up to 500 characters.              |
| isRestaurantPromoted      | Boolean  | Defaults to false.                            |
| offer                     | String   | Optional discount or offer text.              |
| restaurantTags            | String[] | Optional array of tags. Defaults to empty.   |

A compound index exists on `{ restaurantCity: 1, restaurantCuisine: 1 }` to optimize filtered queries.

### MenuItem

Stores individual food items belonging to a restaurant.

| Field                  | Type     | Rules                                              |
|------------------------|----------|----------------------------------------------------|
| restaurantId           | ObjectId | Reference to a Restaurant document. Required. Indexed. |
| menuItemName           | String   | Required. Up to 100 characters.                   |
| menuItemPrice          | Number   | Required. Minimum 0.                              |
| menuItemCategory       | String   | Required. Used for category grouping in the menu. |
| isMenuItemVeg          | Boolean  | Defaults to true.                                 |
| isMenuItemAvailable    | Boolean  | Defaults to true.                                 |
| menuItemImage          | String   | Cloudinary URL. Defaults to empty string.         |
| menuItemDescription    | String   | Optional. Up to 200 characters.                   |
| menuItemRating         | Number   | Between 0 and 5. Defaults to 0.                  |
| menuItemCalories       | Number   | Optional. Defaults to null.                       |
| menuItemServes         | String   | Serving size description. Defaults to "1".        |

A compound index on `{ restaurantId: 1, menuItemCategory: 1 }` optimizes the query for fetching all items in a category for a specific restaurant.

### Cart

Stores the active shopping cart for each user. Each user has exactly one cart document (enforced by a unique index on `userId`).

| Field           | Type       | Rules                                         |
|-----------------|------------|-----------------------------------------------|
| userId          | ObjectId   | Reference to a User document. Required. Unique.|
| restaurantId    | ObjectId   | Reference to the restaurant the cart belongs to. |
| restaurantName  | String     | Name of the restaurant. Defaults to null.     |
| items           | CartItem[] | Array of embedded cart item subdocuments.     |
| totalQuantity   | Number     | Total number of items. Defaults to 0.         |
| totalAmount     | Number     | Total price of all items. Defaults to 0.      |

Each `CartItem` subdocument (embedded inside `items`) contains:

| Field           | Type     | Rules                                |
|-----------------|----------|--------------------------------------|
| menuItemId      | ObjectId | Reference to the MenuItem.           |
| menuItemName    | String   | Required.                            |
| menuItemPrice   | Number   | Required.                            |
| itemQuantity    | Number   | Required. Minimum 1.                 |
| menuItemImage   | String   | Defaults to empty string.            |
| isMenuItemVeg   | Boolean  | Defaults to true.                    |

Cart item subdocuments do not have their own `_id` field.

### Order

Stores completed orders. Each order is a permanent, immutable record of what was purchased.

| Field              | Type        | Rules                                                          |
|--------------------|-------------|----------------------------------------------------------------|
| userId             | ObjectId    | Reference to the User who placed the order. Required. Indexed.|
| restaurantId       | ObjectId    | Reference to the Restaurant. Required. Indexed.               |
| restaurantName     | String      | Name of the restaurant at the time of order. Defaults to "".  |
| orderItems         | OrderItem[] | Array of embedded item snapshots.                             |
| orderTotalAmount   | Number      | Total charge for the order. Required. Minimum 0.             |
| deliveryFee        | Number      | Delivery charge. Defaults to 49.                              |
| deliveryAddress    | String      | Delivery address. Defaults to "".                             |
| paymentStatus      | String      | Enum: PENDING, PAID, FAILED, REFUNDED. Defaults to PENDING.  |
| orderStatus        | String      | Enum: CREATED, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED. Defaults to PREPARING. |

Each `OrderItem` subdocument (embedded inside `orderItems`) is a snapshot of the item at the time of purchase:

| Field        | Type     | Rules              |
|--------------|----------|--------------------|
| menuItemId   | ObjectId | Reference to MenuItem. |
| itemName     | String   | Required.          |
| itemPrice    | Number   | Required. Minimum 0. |
| itemQuantity | Number   | Required. Minimum 1. |
| isVeg        | Boolean  | Defaults to true.  |

A compound index on `{ userId: 1, createdAt: -1 }` ensures that fetching a user's order history sorted by newest first is always fast.

---

<a name="api-reference"></a>
## 🔌 API Reference

All routes are prefixed with `/api/v1`. Protected routes require a valid JWT. The token is read from the `Authorization: Bearer <token>` header. If no header is present, the middleware falls back to reading the `token` cookie.

### Authentication — `/api/v1/auth`

| Method | Path      | Protected | Description                                                       |
|--------|-----------|-----------|-------------------------------------------------------------------|
| POST   | /signup   | No        | Creates a new user account. Validates all input fields before saving. Returns the created user without the password field. |
| POST   | /login    | No        | Validates credentials and returns the user data and a JWT token in the response body. Also sets the token as an HTTP-only cookie for compatible browsers. |
| POST   | /logout   | No        | Clears the token cookie on the server. The client is responsible for removing the token from local storage. |
| GET    | /profile  | Yes       | Returns the authenticated user's profile data without the password field. |
| PUT    | /profile  | Yes       | Accepts a multipart form submission. Updates allowed profile fields. If a file is included, uploads it to Cloudinary and saves the URL. |

### Restaurants — `/api/v1/restaurants`

| Method | Path          | Protected | Description                                                                     |
|--------|---------------|-----------|---------------------------------------------------------------------------------|
| GET    | /             | No        | Returns a paginated list of restaurants. Accepts `page` and `limit` query parameters. Default is page 1, limit 20. Returns data and pagination metadata. |
| GET    | /:resId       | No        | Returns a single restaurant by its MongoDB ObjectId. Returns an error if the ID format is invalid. |
| GET    | /:resId/menu  | No        | Returns all menu items belonging to the specified restaurant.                   |

### Cart — `/api/v1/cart`

| Method | Path | Protected | Description                                                                                    |
|--------|------|-----------|------------------------------------------------------------------------------------------------|
| GET    | /    | Yes       | Returns the authenticated user's cart document. Creates and returns an empty cart if none exists. |
| POST   | /sync| Yes       | Accepts the full cart state from the frontend and overwrites the database cart using upsert.   |
| DELETE | /    | Yes       | Resets the user's cart to an empty state in the database.                                      |

### Orders — `/api/v1/orders`

| Method | Path           | Protected | Description                                                                                    |
|--------|----------------|-----------|------------------------------------------------------------------------------------------------|
| POST   | /              | Yes       | Validates the order payload, fetches each menu item from the database to enrich the order data, and saves the order with payment status PAID. |
| GET    | /              | Yes       | Returns all orders for the authenticated user, sorted by newest first. Populates restaurant details. |
| PATCH  | /:id/status    | Yes       | Updates the status of a specific order. The status must be one of the valid enum values.       |

### Payment — `/api/v1/payment`

| Method | Path              | Protected | Description                                                                          |
|--------|-------------------|-----------|--------------------------------------------------------------------------------------|
| POST   | /create-order     | No        | Creates a Razorpay order with the given amount converted to paise. Returns the Razorpay order ID. |
| POST   | /verify-payment   | No        | Verifies the HMAC-SHA256 payment signature from Razorpay to confirm a valid payment. |

---

<a name="frontend-pages-and-components"></a>
## 🖥️ Frontend Pages and Components

### Application Entry Point — `App.jsx`

`App.jsx` is the root component. It is responsible for two important tasks that run on every page load.

First, it runs an authentication check. It reads the token from local storage and calls the `GET /api/v1/auth/profile` API. If the server returns valid user data, it restores the user's session in Redux without requiring them to log in again. If not, it marks the app as initialized in guest mode.

Second, after the authentication check succeeds, it fetches the user's cart from the database and loads it into the Redux cart slice. This means the cart is always restored to its saved state after every page refresh.

Both of these steps are carefully sequenced to avoid a race condition where two parts of the app try to fetch the cart simultaneously.

### Navigation — `Navbar.jsx`

The navigation bar is shown on all pages. It contains the application logo, navigation links, a search bar, a cart icon with an item count badge, and an authentication control. The authentication control shows a Login button for guest users and a profile popover for logged-in users. Clicking the Orders link when not authenticated intercepts the click and opens the login drawer instead of navigating to the protected page.

The authentication sidebar (`AuthSidebar.jsx`) slides in from the right. It contains the Login and Signup forms. These are loaded lazily using `React.lazy` and `Suspense` so they do not increase the initial page bundle size.

### Restaurant Listing — `Restaurants.jsx`

This page fetches a paginated list of restaurants from the backend on load and stores them in Redux. It then applies all active filters in memory using `useMemo` so filtering and sorting do not require additional network requests. The filter controls are in `RestaurantFilters.jsx`.

### Restaurant Menu — `RestaurantMenu.jsx`

This page reads the restaurant ID from the URL, then calls a custom hook (`useRestaurantMenu.js`) which fetches the restaurant details. Each menu item is rendered as a `MenuItemCard`. Clicking add on a card shows a local quantity picker first. The item is only added to the Redux cart when the user clicks the Confirm button. An "Added" confirmation animation plays for two seconds after confirmation.

### Cart — `CartDrawer.jsx` and `DummyCheckout.jsx`

The cart drawer slides in from the right when the user clicks the cart icon. It shows all current cart items with quantity plus and minus controls, the item subtotals, the delivery fee, and the final total. Clicking Checkout opens the `DummyCheckout` modal.

The checkout modal presents a Razorpay-inspired payment interface. The user selects a payment method from four tabs. Clicking Pay begins a simulated 2-second payment process. On completion, the order is saved to the database via `POST /api/v1/orders`, the cart is cleared in both Redux and the database, and an order success animation plays.

### Orders — `OrderHistory.jsx`

This page fetches the user's complete order history. An order is classified as "active" if it was placed within the last 1 minute and has not been manually marked as delivered. Active orders show a real-time countdown timer and a progress bar that animates from 0 to 100 percent over 60 seconds. When the timer reaches zero, the order moves to the past orders section automatically. Past orders show a styled editorial card layout.

### Profile — `Profile.jsx`

The profile page is split into three subcomponents for maintainability: `ProfileHeader.jsx` for the avatar and action buttons, `ProfileForm.jsx` for the editable fields, and `ProfileEmails.jsx` for the read-only email display. Clicking Edit toggles all fields into an editable state. A preview of the new profile picture is shown before the form is submitted. On save, the data is sent as a multipart form submission and the Redux user state is updated immediately with the server's response.

---

<a name="key-data-flows"></a>
## 🔄 Key Data Flows

### Authentication Flow

```
1. User submits the login form
2. POST /api/v1/auth/login is called with identifier and password
3. The server validates the credentials and generates a JWT
4. The server returns the JWT in the response body along with the user data
5. The frontend stores the token in localStorage
6. The frontend dispatches loginSuccess to Redux with the user data
7. The Navbar updates to show the profile popover
8. The cart is fetched from the database and loaded into Redux
```

### Add to Cart Flow

```
1. User clicks Add on a menu item card
2. If not authenticated, the login sidebar is opened instead
3. A local quantity counter appears on the card
4. User adjusts the quantity
5. User clicks Confirm
6. addItemToCart is dispatched to Redux
7. The Redux store updates the cart state
8. The Redux store subscriber detects the change and waits 1 second (debounce)
9. POST /api/v1/cart/sync is called with the full current cart state
10. The database cart is overwritten with the new state
```

### Checkout Flow

```
1. User opens the cart drawer
2. User reviews items and clicks Checkout Securely
3. The DummyCheckout modal opens
4. User selects a payment method tab
5. User clicks Pay
6. A 2-second simulated payment delay runs
7. POST /api/v1/orders is called with the order payload
8. The order is saved to MongoDB with status PAID and PREPARING
9. clearCart is dispatched to Redux
10. The cart sync subscriber detects the auth-to-unauth transition guard and does NOT sync the empty cart (this protects the saved cart in the database)
11. The OrderSuccess animation plays
12. The CartDrawer closes
```

### Page Refresh — Session Restoration Flow

```
1. User refreshes the page
2. Redux resets to its default empty state (isAuthenticated: false, cart: empty)
3. App.jsx mounts and runs the initial auth check useEffect
4. The token is read from localStorage
5. The Axios request interceptor attaches it as Authorization: Bearer <token>
6. GET /api/v1/auth/profile is called
7. The server reads the header, verifies the JWT, and returns the user data
8. loginSuccess is dispatched to Redux
9. fetchCart runs inline, loading the user's saved cart from MongoDB
10. The page finishes loading with the user fully logged in and cart restored
```

---

<a name="authentication-design"></a>
## 🛡️ Authentication Design

Authentication uses JSON Web Tokens stored in the browser's local storage. This design was chosen specifically to solve a cross-browser compatibility problem.

The original design used HTTP-only cookies. This worked correctly in local development and in some browsers like Arc. However, Safari's Intelligent Tracking Prevention (ITP) policy and Chrome's Incognito Mode both block all third-party cookies unconditionally. Because the frontend is hosted on Vercel (vercel.app) and the backend is on Render (onrender.com), any cookie set by the backend is classified as a third-party cookie by Safari. Safari blocks it silently with no error message.

The solution is to store the token in local storage and send it in the `Authorization: Bearer <token>` HTTP header on every request. Local storage is always same-origin and is never subject to third-party restrictions.

The Axios request interceptor in `axiosInstance.js` handles this automatically. It reads the token from local storage and injects the Authorization header before every outgoing request. No individual API call needs to manually handle this.

The backend middleware (`userAuth.ts`) reads the token from the Authorization header first. If no header is present, it falls back to reading the cookie. This means the system supports both authentication methods simultaneously.

To prevent a stale token from persisting after logout, the `logoutUser` Redux action reducer directly calls `localStorage.removeItem('token')`. This ensures the token is removed regardless of whether logout was triggered through the API call or directly through a Redux dispatch.

---

<a name="local-development-setup"></a>
## 💻 Local Development Setup

### Prerequisites

The following tools must be installed before setting up the project:

- Node.js (version 18 or later recommended)
- npm (included with Node.js)
- A MongoDB Atlas account with a cluster and a connection string
- A Cloudinary account with a cloud name, API key, and API secret
- A Razorpay account with a key ID and key secret (test mode is sufficient for development)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ranvendra/Eats.git
cd Eats
```

### Step 2: Set Up the Backend

Navigate to the server directory and install dependencies. The `--include=dev` flag is required because the TypeScript compiler (`tsc`) is listed as a production dependency but the type definition packages (`@types/*`) are dev dependencies and are needed for the build step.

```bash
cd server
npm install --include=dev
```

Create a `.env` file inside the `server` directory with the following content. Replace each placeholder with your actual credentials.

```
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_secret_string_you_choose
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

Start the backend development server. This uses `ts-node-dev` to compile and run the TypeScript source directly without a separate build step.

```bash
npm run dev
```

The backend will be available at `http://localhost:5001`.

### Step 3: Seed the Database (Optional)

If you want to populate your database with the initial set of restaurants and menu items, you can use the seed data files in the root of the project. You will need to write or run a seed script that reads `restaurants.json` and `menuItem.json` and inserts them into your MongoDB collection.

### Step 4: Set Up the Frontend

Open a new terminal window and navigate to the client directory.

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory.

```
VITE_LOCAL_BACKEND_URL=http://localhost:5001
VITE_BACKEND_URL=https://your-render-deployment-url.onrender.com
```

During development, the application uses `VITE_LOCAL_BACKEND_URL`. During production builds, it uses `VITE_BACKEND_URL`.

Start the frontend development server.

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

<a name="environment-variables"></a>
## 🌐 Environment Variables

### Server (`server/.env`)

| Variable                | Required | Description                                                  |
|-------------------------|----------|--------------------------------------------------------------|
| PORT                    | No       | Port for the Express server. Defaults to 8080 if not set.   |
| MONGODB_URI             | Yes      | Full MongoDB Atlas connection string including the database name. |
| JWT_SECRET              | Yes      | Secret key used to sign and verify JSON Web Tokens. Keep this value private and use a long random string. |
| CLOUDINARY_CLOUD_NAME   | Yes      | Cloudinary cloud name from your account dashboard.          |
| CLOUDINARY_API_KEY      | Yes      | Cloudinary API key.                                          |
| CLOUDINARY_API_SECRET   | Yes      | Cloudinary API secret.                                       |
| RAZORPAY_KEY_ID         | Yes      | Razorpay key ID from your Razorpay dashboard.               |
| RAZORPAY_KEY_SECRET     | Yes      | Razorpay key secret used for payment signature verification. |
| NODE_ENV                | Yes      | Set to `production` on the deployment server. This controls the cookie security flags. |

### Client (`client/.env`)

| Variable               | Required | Description                                                                  |
|------------------------|----------|------------------------------------------------------------------------------|
| VITE_LOCAL_BACKEND_URL | Yes      | The URL of the backend server during local development (e.g., http://localhost:5001). |
| VITE_BACKEND_URL       | Yes      | The URL of the deployed backend server in production (e.g., https://your-render-url.onrender.com). |

---

<a name="deployment"></a>
## 🚢 Deployment

### Backend (Render)

The backend is deployed on Render as a web service.

**Build Command:**
```bash
npm install --include=dev && npm run build
```

This installs all dependencies including the TypeScript compiler, then compiles the TypeScript source files in `src/` to JavaScript files in `dist/`.

**Start Command:**
```bash
npm start
```

This runs `node dist/server.js`, which starts the pre-compiled JavaScript. There is no TypeScript compilation at runtime. This is important because compiling TypeScript at runtime on Render's free tier (512 MB RAM) causes the process to run out of memory and crash.

**Root Directory:** Set to `server` in the Render dashboard service settings.

**Environment Variables:** All variables from the server `.env` table above must be added in the Render dashboard under the Environment tab for the service. Do not commit your `.env` file to the repository.

### Frontend (Vercel)

The frontend is deployed on Vercel. Vercel automatically detects the Vite configuration.

**Build Command:** `npm run build` (auto-detected by Vercel)

**Output Directory:** `dist` (auto-detected by Vercel)

**Root Directory:** Set to `client` in the Vercel project settings.

**Environment Variables:** `VITE_BACKEND_URL` must be set in the Vercel project environment variable settings to point to the deployed Render backend URL.

---

<a name="known-limitations"></a>
## 📝 Known Limitations

The following features are present in the user interface but are not fully implemented at the backend level.

**Payment is simulated.** The `DummyCheckout` component shows a Razorpay-styled interface, but the actual Razorpay payment flow (creating a real order, collecting card or UPI details, and verifying the webhook) is not wired to a live payment. The pay button simulates a 2-second processing delay and then saves the order directly as paid.

**The Reorder button does not function.** On the past orders page, each order card has a Reorder button. This button is visible in the interface but does not trigger any action.

**The Navbar search bar is not wired to a search function.** The search input in the navigation bar accepts text input but does not filter restaurants or navigate to any search results page. The filter controls on the restaurant listing page do perform functional client-side search.

**The cost sort option uses rating data.** The Sort by Cost options in the restaurant filter panel currently sort on the restaurant rating field instead of a dedicated cost or price range field. Restaurant documents do not have a single cost field; adding this properly would require a schema update and data migration.

---

<a name="license"></a>
## 📜 License

This project is licensed under the ISC License.
