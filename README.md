# Eats - Full Stack Food Delivery Application

A modern, full-stack food delivery and restaurant discovery platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **User Authentication:** Secure signup and login using JWT and Bcrypt.
- **Restaurant Discovery:** Browse a wide range of restaurants with advanced filtering and pagination.
- **Dynamic Menu:** View detailed restaurant menus with categorized items.
- **Cart Management:** Seamlessly add/remove items and manage quantities in a persistent cart.
- **Order System:** Complete order lifecycle with history tracking.
- **Payment Integration:** Integrated with Razorpay for secure transactions.
- **Profile Management:** Users can update their personal information and manage delivery addresses.
- **Image Uploads:** Powered by Cloudinary for efficient menu and profile image storage.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (Vite)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **Icons:** Lucide React
- **Routing:** React Router 7

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Cookie-parser
- **Image Hosting:** Cloudinary
- **Payment:** Razorpay
- **Validation:** Validator.js

## 📁 Project Structure

```text
Eats/
├── client/                # Frontend React Application
│   ├── src/
│   │   ├── api/          # Axios instance and API calls
│   │   ├── authPage/     # Login and Signup components
│   │   ├── Cart/         # Cart and Checkout logic
│   │   ├── HomePage/     # Hero, Navbar, and Home layout
│   │   ├── Orders/       # Order history and tracking
│   │   ├── Profile/      # User profile management
│   │   ├── Restaurants/  # Restaurant listing and menu details
│   │   ├── utils/        # Redux slices and constants
│   │   └── main.jsx      # Entry point
│   └── package.json
│
├── server/                # Backend Express API
│   ├── src/
│   │   ├── config/       # DB, Cloudinary, and Multer configs
│   │   ├── controllers/  # Business logic for routes
│   │   ├── models/       # Mongoose schemas (User, Restaurant, Order, etc.)
│   │   ├── routes/       # API route definitions
│   │   ├── middlewares/  # Auth and error handling middlewares
│   │   └── server.js     # Server entry point
│   ├── seed.js           # Database seeding script
│   └── package.json
│
├── restaurants.json      # Initial data for restaurants
└── menuItem.json         # Initial data for menu items
```

## 🛠️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI
- Cloudinary Credentials
- Razorpay API Keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Eats
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   # Create a .env file with required variables
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   # Create a .env file with VITE_API_URL
   npm run dev
   ```

## 📜 License
This project is licensed under the ISC License.
