# Eats - Architectural Flowcharts

This document provides a visual representation of the architecture and data flow within the Eats application. It uses [Mermaid.js](https://mermaid.js.org/) to render the flowcharts.

## 1. High-Level System Architecture

This diagram illustrates the macro-level interactions between the React frontend, the Node/Express backend, the MongoDB database, and third-party external services.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#68A063,stroke:#333,stroke-width:2px,color:#fff;
    classDef database fill:#47A248,stroke:#333,stroke-width:2px,color:#fff;
    classDef external fill:#F05032,stroke:#333,stroke-width:2px,color:#fff;

    %% Client / Frontend
    subgraph Client [Frontend: React 19 + Vite]
        UI[User Interface Components]:::frontend
        State[Redux Toolkit Store<br>(userSlice, cartSlice, restaurantSlice)]:::frontend
        API_Client[Axios Instance / API Utils]:::frontend
        
        UI <--> State
        UI --> API_Client
    end

    %% Server / Backend
    subgraph Server [Backend: Node.js + Express]
        Router[Express Routers<br>(auth, restaurant, cart, order, payment)]:::backend
        AuthMid[Auth Middleware<br>(JWT verification)]:::backend
        Controllers[Controllers Logic]:::backend
        Models[Mongoose Models<br>(User, Restaurant, MenuItem, Cart, Order)]:::backend
        
        API_Client -->|REST API Calls (JSON)| Router
        Router --> AuthMid
        AuthMid --> Controllers
        Router --> Controllers
        Controllers <--> Models
    end

    %% Database
    subgraph Database Layer
        DB[(MongoDB)]:::database
        Models <-->|Read / Write (Mongoose)| DB
    end

    %% External Services
    subgraph External APIs
        Cloudinary[Cloudinary<br>(Image Hosting)]:::external
        Razorpay[Razorpay<br>(Payment Gateway)]:::external
        
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

## 4. Entity-Relationship Diagram (ERD)

A simplified view of how the primary MongoDB collections relate to each other.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o| CART : has
    RESTAURANT ||--o{ MENU_ITEM : offers
    ORDER }|--|| RESTAURANT : belongs_to
    CART }o--|| RESTAURANT : from
    
    USER {
        ObjectId _id
        String name
        String email
        String password
        String contact
        Object address
    }
    
    RESTAURANT {
        ObjectId _id
        String name
        String description
        String imageUrl
        Array cuisines
        Object location
    }
    
    MENU_ITEM {
        ObjectId _id
        ObjectId restaurantId
        String name
        Number price
        String category
        Boolean isVegetarian
    }
    
    ORDER {
        ObjectId _id
        ObjectId userId
        ObjectId restaurantId
        Array items
        Number totalAmount
        String status
        String paymentStatus
    }
    
    CART {
        ObjectId _id
        ObjectId userId
        ObjectId restaurantId
        Array items
        Number total
    }
```
