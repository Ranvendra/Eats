## 1. High-Level System Architecture

This diagram illustrates the macro-level interactions between the React frontend, the Node/Express backend, the MongoDB database, and third-party external services.

```mermaid
graph TD

    %% Client / Frontend
    subgraph Client [Frontend: React 19 + Vite]
        UI[User Interface Components]
        State[Redux Toolkit Store - userSlice, cartSlice, restaurantSlice]
        API_Client[Axios Instance / API Utils]
        
        UI <--> State
        UI --> API_Client
    end

    %% Server / Backend
    subgraph Server [Backend: Node.js + Express]
        Router[Express Routers - auth, restaurant, cart, order, payment]
        AuthMid[Auth Middleware - JWT verification]
        Controllers[Controllers Logic]
        Models[Mongoose Models - User, Restaurant, MenuItem, Cart, Order]
        
        API_Client -->|REST API Calls JSON| Router
        Router --> AuthMid
        AuthMid --> Controllers
        Router --> Controllers
        Controllers <--> Models
    end

    %% Database
    subgraph DatabaseLayer [Database Layer]
        DB[(MongoDB)]
        Models <-->|Read / Write Mongoose| DB
    end

    %% External Services
    subgraph ExternalAPIs [External Services]
        Cloudinary[Cloudinary - Image Hosting]
        Razorpay[Razorpay - Payment Gateway]
        
        Controllers -.->|Image Upload / Retrieval| Cloudinary
        Controllers -.->|Payment Creation / Verification| Razorpay
    end
```

---

## 2. User Authentication Flow

This diagram outlines the process of a user signing up or logging in, demonstrating how JWTs (JSON Web Tokens) are generated and managed.

```mermaid
sequenceDiagram
    participant User
    participant React UI
    participant Express Server
    participant MongoDB

    User->>React UI: Enters Credentials (Login/Signup)
    React UI->>Express Server: POST /api/auth/login
    
    Express Server->>MongoDB: Find User by Email
    MongoDB-->>Express Server: User Document
    
    alt User not found or Invalid Password
        Express Server-->>React UI: 401 Unauthorized / Error Message
        React UI-->>User: Show Error Toast
    else Valid Credentials
        Express Server->>Express Server: Generate JWT Token & Set HTTP-Only Cookie
        Express Server-->>React UI: 200 OK + User Data (Excluding Password)
        React UI->>React UI: Update Redux userSlice state
        React UI-->>User: Redirect to Home Page
    end
```

---

## 3. Order and Checkout Flow

This flowchart tracks the user's journey from adding items to the cart, confirming an order, processing payment via Razorpay, and saving the final order to the database.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Redux/React)
    participant Backend (Express)
    participant Razorpay API
    participant MongoDB

    %% Cart Management
    User->>Frontend (Redux/React): Browse Menu & Add to Cart
    Frontend (Redux/React)->>Backend (Express): POST /api/cart (Sync Cart)
    Backend (Express)->>MongoDB: Update/Create Cart Document
    MongoDB-->>Backend (Express): Cart Updated
    Backend (Express)-->>Frontend (Redux/React): Updated Cart Data

    %% Checkout Initialization
    User->>Frontend (Redux/React): Click "Checkout"
    Frontend (Redux/React)->>Backend (Express): POST /api/payment/create-order
    
    %% Razorpay Order Creation
    Backend (Express)->>Razorpay API: Request Order Creation (Amount)
    Razorpay API-->>Backend (Express): Razorpay Order ID
    Backend (Express)-->>Frontend (Redux/React): Order ID & Key

    %% Payment Processing
    Frontend (Redux/React)->>Razorpay API: Open Payment Modal (User enters details)
    Razorpay API-->>Frontend (Redux/React): Payment Success (payment_id, signature)
    
    %% Payment Verification and Order Finalization
    Frontend (Redux/React)->>Backend (Express): POST /api/payment/verify
    Backend (Express)->>Backend (Express): Validate Signature (crypto)
    
    alt Signature Valid
        Backend (Express)->>MongoDB: Create new Order Document (Status: Paid)
        Backend (Express)->>MongoDB: Clear User's Cart
        MongoDB-->>Backend (Express): Success
        Backend (Express)-->>Frontend (Redux/React): 200 OK (Order Confirmed)
        Frontend (Redux/React)->>Frontend (Redux/React): Clear Redux Cart & Show Success Animation
        Frontend (Redux/React)-->>User: Redirect to Order History / Success Page
    else Signature Invalid
        Backend (Express)-->>Frontend (Redux/React): 400 Bad Request (Payment Failed)
        Frontend (Redux/React)-->>User: Show Failure Toast
    end
```

---