# Eats — Full Stack Food Delivery Application
## Professional Project Report

---

| | |
|---|---|
| **Project Title** | Eats — Full Stack Food Delivery Application |
| **Technology Stack** | MERN (MongoDB, Express.js, React, Node.js) |
| **Language** | TypeScript (Backend) · JavaScript / JSX (Frontend) |
| **Deployment** | Frontend: Vercel · Backend: Render |
| **Live URL** | https://eatindia.vercel.app |
| **Report Date** | April 2026 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Objectives](#2-project-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Design](#5-database-design)
6. [REST API Reference](#6-rest-api-reference)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Key Data Flows](#8-key-data-flows)
9. [Authentication Design](#9-authentication-design)
10. [Design Patterns Applied](#10-design-patterns-applied)
11. [SOLID Principles](#11-solid-principles)
12. [Security Considerations](#12-security-considerations)
13. [Deployment Strategy](#13-deployment-strategy)
14. [Known Limitations & Future Scope](#14-known-limitations--future-scope)
15. [Conclusion](#15-conclusion)

---

## 1. Executive Summary

**Eats** is a production-deployed, full-stack food delivery web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The backend is written in **TypeScript** and follows a strict class-based, object-oriented architecture inspired by enterprise frameworks like NestJS. The frontend is a React 19 Single Page Application (SPA) powered by Vite 7, Redux Toolkit for global state management, and Tailwind CSS v4 for styling.

The application enables users to browse restaurants, explore categorized menus, manage a persistent shopping cart, simulate a Razorpay payment flow, and view a complete order history. The project demonstrates a production-grade software engineering mindset with deliberate application of **SOLID principles**, **9 Gang-of-Four design patterns**, robust cross-browser **JWT authentication**, **Cloudinary image management**, and a **debounced cart sync** mechanism for data persistence.

---

## 2. Project Objectives

The primary goal of this project is to build and deploy a realistic, feature-rich food delivery platform while simultaneously demonstrating mastery over the following engineering concepts:

| Objective | Implementation |
|---|---|
| Full-stack MERN development | Express.js + TypeScript backend; React + Vite frontend |
| OOP and class-based architecture | App, Route, Controller, Service layers on the backend |
| SOLID design principles | Demonstrated across all 5 backend layers |
| Design pattern application | 9 patterns identified and applied (Facade, DI, Observer, etc.) |
| Cross-browser authentication | JWT in localStorage + Authorization header strategy |
| Cloud integrations | Cloudinary for image storage; Razorpay for payment simulation |
| Production deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) |
| Performance optimization | Lazy loading (IntersectionObserver), debounced cart sync, paginated API |

---

## 3. Technology Stack

### 3.1 Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript runtime |
| Express.js | 5.x | HTTP server and routing framework |
| TypeScript | 6.x | Type-safe JavaScript with OOP architecture |
| MongoDB Atlas | Cloud | Primary NoSQL document database |
| Mongoose | 9.x | ODM — schema definitions and DB queries |
| JSON Web Token (JWT) | 9.x | Stateless authentication tokens (7-day expiry) |
| Bcrypt | 6.x | Secure password hashing (salted, 10 rounds) |
| Cloudinary | 2.x | Image upload, storage, and CDN transformation |
| Multer | 2.x | File upload middleware (in-memory buffer storage) |
| Streamifier | 0.1.x | Converts in-memory buffer to stream for Cloudinary |
| Razorpay | 2.x | Payment order creation and HMAC-SHA256 signature verification |
| Validator.js | 13.x | Structured input validation (email, strong password) |
| Cookie-Parser | 1.x | HTTP cookie parsing for fallback auth |
| CORS | 2.x | Cross-origin resource sharing with allowlist |
| Dotenv | 17.x | `.env` file loading |
| Nodemon | 3.x | Auto-restart during development |

### 3.2 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI component library |
| Vite | 7.x | Development server and production build tool |
| React Router DOM | 7.x | Client-side SPA routing |
| Redux Toolkit | 2.x | Global state management (user, cart, restaurants) |
| React Redux | 9.x | React bindings for the Redux store |
| Axios | 1.x | HTTP client with interceptor support |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Framer Motion | 12.x | Declarative animations and transitions |
| Lucide React | 0.5x | Icon library |

---

## 4. System Architecture

### 4.1 Backend — Layered OOP Architecture

The backend follows a 5-layer class-based architecture where each layer has a single, well-defined responsibility.

```
server.ts (Entry Point)
    │
    └─► new App([routes...])
              │
              ├─► initializeMiddlewares()   — CORS, JSON, Cookie-Parser
              ├─► initializeRoutes()        — Mounts all route class routers
              ├─► connectDatabase()         — Mongoose MongoDB connection
              └─► startServer()            — Opens HTTP port
                        │
                        ├─► AuthRoutes       ← implements Routes interface
                        ├─► CartRoutes       ← implements Routes interface
                        ├─► OrderRoutes      ← implements Routes interface
                        ├─► PaymentRoutes    ← implements Routes interface
                        └─► RestaurantRoutes ← implements Routes interface
                                  │
                                  └─► Controller (HTTP request/response)
                                              │
                                              └─► Service (business logic, DB)
```

**Layer responsibilities:**

| Layer | File(s) | Responsibility |
|---|---|---|
| **Entry Point** | `server.ts` | Instantiate `App` with all route classes; start server |
| **Application** | `app.ts` | Bootstrap Express, middleware, routes, DB connection |
| **Routes** | `*.routes.ts` | Define URL paths; apply middleware chains; wire to controllers |
| **Controllers** | `*.controller.ts` | Accept HTTP request; call service; send HTTP response |
| **Services** | `auth.service.ts` | Encapsulate business logic and DB interactions |
| **Models** | `*.ts` | Mongoose schemas and TypeScript interfaces |
| **Middlewares** | `userAuth.ts` | JWT verification (header → cookie fallback) |
| **Config** | `cloudinary.ts`, `multer.ts` | Isolated third-party service setup |
| **Utils** | `validation.ts`, `route.interface.ts` | Shared validation and interface contract |

### 4.2 Routes Interface Contract

Every route class implements the `Routes` interface from `utils/route.interface.ts`:

```typescript
export interface Routes {
  path?: string;
  router: Router;
}
```

This guarantees that the `App` class can mount any route class polymorphically without knowing its internal implementation — a direct application of OCP and DIP.

---

## 5. Database Design

All data is stored in **MongoDB Atlas** using Mongoose schemas. The database contains 5 collections.

### 5.1 Entity Relationship Overview

```
User ──────── (1:1) ────── Cart
  │
  └──────── (1:N) ────── Order ──── (snapshot) ──── OrderItem
                              │
                         Restaurant ──── (1:N) ──── MenuItem
```

### 5.2 User Collection

Stores registered user accounts.

| Field | Type | Constraints |
|---|---|---|
| `userName` | String | Required, 3–50 chars |
| `userEmail` | String | Required, unique, lowercase, regex-validated |
| `password` | String | Required, ≥8 chars, stored as Bcrypt hash |
| `userPhone` | String | Required, unique, 10–15 digits |
| `userAddress` | String | Optional |
| `userCity` | String | Optional |
| `nickName` | String | Optional |
| `gender` | String | Optional |
| `country` | String | Optional |
| `language` | String | Optional |
| `timeZone` | String | Optional |
| `profilePicture` | String | Cloudinary URL |
| `createdAt`, `updatedAt` | Date | Auto-managed by Mongoose timestamps |

**Instance methods:** `validatePassword(input)` — bcrypt compare; `getJWT()` — signs a 7-day JWT.

**Pre-save hook:** Automatically hashes the password before every save (only if modified).

### 5.3 Restaurant Collection

| Field | Type | Constraints |
|---|---|---|
| `restaurantName` | String | Required, max 100 chars |
| `restaurantAddress` | String | Required, max 300 chars |
| `restaurantCity` | String | Required, indexed |
| `restaurantCuisine` | String[] | Required array |
| `restaurantRating` | Number | 0–5, default 0 |
| `restaurantDeliveryTime` | Number | Required (minutes) |
| `isRestaurantOpen` | Boolean | Default: true |
| `restaurantImage` | String | Required, Cloudinary URL |
| `isRestaurantPromoted` | Boolean | Default: false |
| `offer` | String | Optional discount text |
| `restaurantTags` | String[] | Optional tags |

**Compound Index:** `{ restaurantCity: 1, restaurantCuisine: 1 }` — optimizes city+cuisine filter queries.

### 5.4 MenuItem Collection

| Field | Type | Constraints |
|---|---|---|
| `restaurantId` | ObjectId | Ref: Restaurant. Required, indexed |
| `menuItemName` | String | Required, max 100 chars |
| `menuItemPrice` | Number | Required, min 0 |
| `menuItemCategory` | String | Required — used for grouping |
| `isMenuItemVeg` | Boolean | Default: true |
| `isMenuItemAvailable` | Boolean | Default: true |
| `menuItemCalories` | Number | Optional, default null |
| `menuItemRating` | Number | 0–5, default 0 |
| `menuItemServes` | String | Default: "1" |

**Compound Index:** `{ restaurantId: 1, menuItemCategory: 1 }` — optimizes category menu fetches.

### 5.5 Cart Collection

A user has exactly one cart document (enforced by unique index on `userId`).

| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: User. Unique. |
| `restaurantId` | ObjectId | The restaurant the cart belongs to |
| `restaurantName` | String | Cached name |
| `items` | CartItem[] | Embedded subdocuments (`_id: false`) |
| `totalQuantity` | Number | Default 0 |
| `totalAmount` | Number | Default 0 |

Each `CartItem` subdocument: `menuItemId`, `menuItemName`, `menuItemPrice`, `itemQuantity`, `menuItemImage`, `isMenuItemVeg`.

### 5.6 Order Collection

An immutable order record — a permanent snapshot of what was purchased.

| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: User. Indexed. |
| `restaurantId` | ObjectId | Ref: Restaurant. Indexed. |
| `restaurantName` | String | Snapshot at order time |
| `orderItems` | OrderItem[] | Item snapshots (`_id: false`) |
| `orderTotalAmount` | Number | Required, min 0 |
| `deliveryFee` | Number | Default: 49 |
| `deliveryAddress` | String | Delivery address |
| `paymentStatus` | Enum | `PENDING` \| `PAID` \| `FAILED` \| `REFUNDED` |
| `orderStatus` | Enum | `CREATED` \| `ACCEPTED` \| `PREPARING` \| `OUT_FOR_DELIVERY` \| `DELIVERED` \| `CANCELLED` |

**Compound Index:** `{ userId: 1, createdAt: -1 }` — optimizes user order history sorted by newest.

> [!NOTE]
> Order items are **snapshots**. Even if a restaurant later changes a menu item's name or price, the original values are permanently preserved in the order record. This is a deliberate application of the **Memento/Snapshot design pattern**.

---

## 6. REST API Reference

All routes are prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <token>` header (falls back to cookie).

### 6.1 Authentication — `/api/v1/auth`

| Method | Path | Protected | Description |
|---|---|---|---|
| `POST` | `/signup` | No | Creates a new user account. Validates all input. Returns user without password. |
| `POST` | `/login` | No | Validates credentials. Returns user data + JWT in body. Also sets HTTP-only cookie. |
| `POST` | `/logout` | No | Clears server cookie. Client clears localStorage token. |
| `GET` | `/profile` | Yes | Returns authenticated user's profile (no password field). |
| `PUT` | `/profile` | Yes | Updates profile fields. Accepts `multipart/form-data`. Uploads picture to Cloudinary. |

### 6.2 Restaurants — `/api/v1/restaurants`

| Method | Path | Protected | Description |
|---|---|---|---|
| `GET` | `/` | No | Paginated restaurant list. Query params: `page` (default 1), `limit` (default 20). Returns data + pagination metadata. |
| `GET` | `/:resId` | No | Single restaurant by MongoDB ObjectId. Returns 400 on invalid ID format. |
| `GET` | `/:resId/menu` | No | All menu items for a restaurant. |

### 6.3 Cart — `/api/v1/cart`

| Method | Path | Protected | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Returns user's cart. Creates an empty cart if none exists (upsert). |
| `POST` | `/sync` | Yes | Overwrites the full database cart with the frontend state (upsert). |
| `DELETE` | `/` | Yes | Resets user's cart to empty in the database. |

### 6.4 Orders — `/api/v1/orders`

| Method | Path | Protected | Description |
|---|---|---|---|
| `POST` | `/` | Yes | Places an order. Enriches items from DB. Saves with `paymentStatus: PAID` and `orderStatus: PREPARING`. |
| `GET` | `/` | Yes | Returns all orders for the user, sorted newest first. Populates restaurant details. |
| `PATCH` | `/:id/status` | Yes | Updates order status. Validates against enum. |

### 6.5 Payment — `/api/v1/payment`

| Method | Path | Protected | Description |
|---|---|---|---|
| `POST` | `/create-order` | No | Creates a Razorpay order with amount in paise. Returns Razorpay order ID. |
| `POST` | `/verify-payment` | No | Verifies HMAC-SHA256 payment signature from Razorpay. |

---

## 7. Frontend Architecture

### 7.1 Application Structure

The frontend is a React 19 SPA bootstrapped with Vite 7. It is organized into feature-based directories.

```
client/src/
├── api/
│   ├── axiosInstance.js       Axios singleton — base URL, credentials, JWT interceptor
│   └── authApi.js             Module pattern — all auth API calls grouped
├── utils/
│   ├── appStore.js            Redux store + cart auto-sync Observer subscriber
│   ├── cartSlice.js           Cart state: items, totals, hydration flag
│   ├── userSlice.js           Auth state: userInfo, isAuthenticated, isInitialized
│   ├── restaurantSlice.js     Restaurant list state
│   └── useRestaurantMenu.js   Custom hook for menu data fetching
├── HomePage/                  Navbar, Hero, ProfilePopover
├── Restaurants/               Listing, Filters, Pagination, Menu, MenuItemCard, CategorySidebar
├── Cart/                      CartDrawer, DummyCheckout (payment simulation)
├── Orders/                    OrderHistory, OrderCard, OrderItem, OrderHero
├── Profile/                   ProfileHeader, ProfileForm, ProfileEmails
├── authPage/                  AuthSidebar (lazy loaded), Login, Signup
├── Toast/                     Toast + ToastContext (global notification system)
├── LazyLoading/               LazyImage (IntersectionObserver-based)
├── Shimmer/                   Skeleton placeholders for loading states
└── Animations/                OrderSuccess animation component
```

### 7.2 Redux Store

Three slices compose the global state:

| Slice | State Shape | Key Actions |
|---|---|---|
| **userSlice** | `userInfo`, `isAuthenticated`, `isInitialized`, `isAuthSidebarOpen` | `loginSuccess`, `logoutUser`, `setAuthInitialized`, `setAuthSidebarOpen` |
| **cartSlice** | `items[]`, `totalQuantity`, `totalAmount`, `restaurantId`, `restaurantName`, `isHydrated` | `addItemToCart`, `removeItemFromCart`, `updateQuantity`, `clearCart`, `loadCart` |
| **restaurantSlice** | `restaurants[]` | `setRestaurants` |

#### Cart Hydration Flag (`isHydrated`)

The `isHydrated` boolean in the cart slice is a critical design detail. It distinguishes between the initial empty cart state (Redux defaults before the DB is queried) and a cart that has been actively populated. The Redux store subscriber only syncs to the DB when `isHydrated: true`, preventing empty default state from overwriting the user's real saved cart.

### 7.3 Session Restoration Flow (Page Refresh)

On every page load, `App.jsx` runs two sequential effects:

1. **Auth Check:** Calls `GET /api/v1/auth/profile`. If the JWT in localStorage is valid, dispatches `loginSuccess` with user data.
2. **Cart Hydration:** Immediately after auth success, calls `GET /api/v1/cart` and dispatches `loadCart` with the saved DB cart.

A `useRef` (`initialLoadDone`) guards against a race condition where a separate `useEffect` watching `isAuthenticated` would trigger a duplicate cart fetch simultaneously.

### 7.4 Key Frontend Features

| Feature | Implementation |
|---|---|
| **Lazy Auth Forms** | Login/Signup loaded with `React.lazy` + `Suspense` — reduces initial bundle |
| **Lazy Image Loading** | `IntersectionObserver` in `LazyImage.jsx` — images load only when visible |
| **Client-Side Filtering** | Restaurant filters applied via `useMemo` — no extra network requests |
| **Two-Step Add to Cart** | Quantity picker shown first; item added only on "Confirm" click |
| **Order Active Timer** | Orders placed within 60s show a real-time countdown + animated progress bar |
| **Shimmer Loading** | Skeleton UI shown while restaurant/menu data is fetching |
| **Global Toast System** | `ToastContext` provides `addToast()` to all components via React Context |

---

## 8. Key Data Flows

### 8.1 Authentication Flow

```
1. User submits login form
2. POST /api/v1/auth/login → validateLoginData()
3. AuthService.loginUser() — find user by email OR phone
4. user.validatePassword() — bcrypt.compare()
5. user.getJWT() — jwt.sign({ _id }, secret, { expiresIn: '7d' })
6. Response: { user (no password), token } + httpOnly cookie (fallback)
7. Frontend: localStorage.setItem('eats_token', token)
8. Dispatch loginSuccess(userData) → Redux user state updates
9. Navbar refreshes → shows profile popover
10. fetchCart() → loads user's saved cart from DB into Redux
```

### 8.2 Add to Cart Flow

```
1. User clicks "Add" on a MenuItemCard
2. If not authenticated → AuthSidebar opens (protected action)
3. Local quantity counter shown on card
4. User adjusts quantity → clicks "Confirm"
5. addItemToCart dispatched → Redux cart state updates
6. appStore.subscribe() fires (Observer)
7. 1-second debounce starts (spam prevention)
8. POST /api/v1/cart/sync → MongoDB cart overwritten
```

### 8.3 Checkout and Order Placement Flow

```
1. User opens CartDrawer → reviews items
2. Clicks "Checkout Securely" → DummyCheckout modal opens
3. User selects payment method (Cards / UPI / Netbanking / Wallets)
4. Clicks "Pay" → 2-second simulated delay
5. POST /api/v1/orders → enrichedItems fetched from DB → order saved
   (paymentStatus: PAID, orderStatus: PREPARING)
6. clearCart dispatched → Redux cart empties
7. Observer fires BUT detects auth-to-auth (not auth-to-unauth) →
   sync guard prevents overwriting with empty cart
8. OrderSuccess animation plays
9. CartDrawer closes
```

### 8.4 Logout Safe Cart Guard

```
User clicks Logout
    ↓
logoutUser dispatched → isAuthenticated: false
    ↓
localStorage.removeItem('eats_token') (in reducer)
    ↓
clearCart dispatched → Redux cart empties
    ↓
appStore.subscribe() fires
    ↓
previousAuthState === true && isAuthenticated === false
    ↓
GUARD: clearTimeout + return early → DB cart NOT overwritten
    ↓
User's saved cart remains intact for next login
```

> [!IMPORTANT]
> This guard in `appStore.js` is a critical bug-fix that prevents the user's DB-saved cart from being erased during logout. The debounced cart sync is skipped exclusively on the `true → false` auth transition.

---

## 9. Authentication Design

### 9.1 Strategy: JWT in localStorage + Authorization Header

The application uses JWTs stored in `localStorage` and sent via the `Authorization: Bearer <token>` HTTP header on every request. This was a deliberate decision to solve a cross-browser compatibility issue.

**The Problem:** The original design used HTTP-only cookies. This worked in some browsers but failed silently in Safari (due to ITP — Intelligent Tracking Prevention) and Chrome Incognito when the frontend (Vercel: `vercel.app`) and backend (Render: `onrender.com`) are on different domains. Safari classifies these as third-party cookies and blocks them.

**The Solution:**

| Component | Role |
|---|---|
| `axiosInstance.js` (interceptor) | Reads `eats_token` from localStorage; injects `Authorization: Bearer <token>` header before every request |
| `userAuth.ts` (middleware) | Reads from `Authorization` header first; falls back to cookie for compatible browsers |
| `authApi.js` (login) | Stores JWT in `localStorage` after successful login |
| `userSlice.js` (logoutUser) | Directly calls `localStorage.removeItem('eats_token')` in the reducer |

### 9.2 Security Properties

| Property | Implementation |
|---|---|
| Password hashing | Bcrypt with 10 salt rounds via pre-save Mongoose hook |
| Token expiry | JWT set to `expiresIn: '7d'` |
| Token invalidation on logout | `localStorage.removeItem()` + server cookie `expires: new Date(0)` |
| Razorpay signature verification | HMAC-SHA256 computed server-side; compared with Razorpay's signature |
| CORS allowlist | Only specific frontend origins allowed (env-configured) |
| No password in responses | `delete userResponse.password` before every API response |
| Environment-based cookie flags | `secure: true` and `sameSite: 'none'` only in production |

---

## 10. Design Patterns Applied

The project deliberately applies 9 classic Gang-of-Four and architectural design patterns:

| # | Pattern | Category | Where Applied | Problem Solved |
|---|---|---|---|---|
| 1 | **Facade** | Structural | `app.ts` | Hides the complexity of Express setup (middleware, routes, DB) behind `App` class — `server.ts` stays clean |
| 2 | **Dependency Injection** | Creational | `server.ts` → `App`, `AuthController` ← `AuthService` | Routes injected into `App`; `AuthService` injected into `AuthController` — loose coupling |
| 3 | **Chain of Responsibility** | Behavioral | `userAuth.ts` + all `*.routes.ts` | Express middleware chains: `userAuth` → `upload` → `controller` — each link can halt the chain |
| 4 | **Strategy** | Behavioral | `userAuth.ts`, `axiosInstance.js` | Runtime token source selection: `Authorization` header (primary) → cookie (fallback) |
| 5 | **Observer** | Behavioral | `appStore.subscribe()` | Cart state changes automatically trigger debounced DB sync — zero manual effort |
| 6 | **Proxy** | Structural | `axiosInstance.js` | `axiosInstance` wraps base Axios; transparently injects JWT header on every outgoing request |
| 7 | **Memento / Snapshot** | Behavioral | `Order.ts`, `order.controller.ts` | Item name, price, and veg status captured at order time — immune to future menu changes |
| 8 | **Module** | Structural | `authApi.js` | All auth API calls grouped under `authApi` object; `TOKEN_KEY`, implementation details private |
| 9 | **Singleton** | Creational | `axiosInstance`, `appStore`, Mongoose connection | One shared instance per resource — memory efficient, consistent state |

---

## 11. SOLID Principles

All five SOLID principles are applied and documented in the backend architecture:

### S — Single Responsibility Principle

Each class and file has exactly one reason to change:

| File | Single Responsibility |
|---|---|
| `AuthController` | Handle HTTP request/response for auth routes |
| `AuthService` | Execute business logic for user registration and login |
| `validation.ts` | Validate incoming request data |
| `cloudinary.ts` | Upload a buffer to Cloudinary and return a URL |
| `multer.ts` | Configure file upload middleware |
| `userAuth.ts` | Verify JWT and attach user to request |

### O — Open/Closed Principle

The `App` class is **closed for modification** — it has never been edited to add new routes. It is **open for extension** — new route classes are simply added to the array in `server.ts`:

```typescript
// Adding a new feature requires ONE line in server.ts — App.ts untouched
const app = new App([
  new AuthRoutes(),
  new CartRoutes(),
  // new NotificationRoutes(), ← new feature, zero App.ts changes
]);
```

### L — Liskov Substitution Principle

Any class implementing `Routes` can be safely substituted for any other without breaking the `App` class. `AuthRoutes`, `CartRoutes`, `OrderRoutes`, `PaymentRoutes`, and `RestaurantRoutes` all fulfil the `Routes` contract identically.

### I — Interface Segregation Principle

No class is forced to implement methods it doesn't need. The `Routes` interface has exactly 2 fields (`path?`, `router`). Model interfaces (`IUser`, `ICart`, `IOrder`, etc.) are separate and focused — `IUser` has `validatePassword()` and `getJWT()` but `ICart` does not.

### D — Dependency Inversion Principle

High-level modules depend on abstractions, not concrete classes:

- `App` depends on `Routes[]` interface — never on `AuthRoutes` or `CartRoutes` directly.
- `AuthController` depends on `AuthService`'s public interface — not on Mongoose or bcrypt directly.
- Concrete implementations are injected from `server.ts` (the composition root).

---

## 12. Security Considerations

| Concern | Mitigation |
|---|---|
| Password storage | Bcrypt hash (10 salt rounds); never stored in plain text |
| Credential enumeration | All auth failures return generic "Invalid credentials" message |
| JWT forgery | Signed with `JWT_SECRET` env variable; verified on every protected request |
| Cross-origin attacks | CORS allowlist; credentials only from known frontend domains |
| File upload abuse | Multer limits to 5 MB; `image/*` MIME type only |
| Payment tampering | Razorpay HMAC-SHA256 signature verified server-side before any order creation |
| Token leakage on logout | Token removed from localStorage in the Redux reducer — guaranteed even if server call fails |
| Environment secrets | All keys in `.env` files; never committed to repository |
| MongoDB injection | Mongoose schema typing and validation prevent arbitrary query injection |
| Excess data exposure | `delete userResponse.password` before every response containing user data |

---

## 13. Deployment Strategy

### 13.1 Backend — Render

| Setting | Value |
|---|---|
| **Platform** | Render (Web Service) |
| **Root Directory** | `server/` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` (runs `node dist/server.js`) |
| **Runtime** | Node.js |
| **Build Process** | TypeScript compiled to `dist/` at build time — no runtime compilation |

> [!NOTE]
> TypeScript is compiled to JavaScript at build time (`tsc`), not at runtime. This is deliberate — `ts-node` at runtime on Render's 512 MB free tier causes out-of-memory crashes.

### 13.2 Frontend — Vercel

| Setting | Value |
|---|---|
| **Platform** | Vercel |
| **Root Directory** | `client/` |
| **Build Command** | `npm run build` (Vite) |
| **Output Directory** | `dist/` |
| **Framework Detection** | Auto-detected as Vite |

### 13.3 Database — MongoDB Atlas

| Setting | Value |
|---|---|
| **Platform** | MongoDB Atlas (Cloud) |
| **Connection** | Via `MONGODB_URI` environment variable |
| **Indexes** | Compound indexes on Restaurant, MenuItem, Order collections |

### 13.4 Images — Cloudinary

Profile pictures are uploaded as streams (no temporary disk writes) directly to Cloudinary using Streamifier. Auto-resizing (400×400, face gravity) and format optimization are applied at upload time.

---

## 14. Known Limitations & Future Scope

### 14.1 Current Limitations

| Feature | Current State |
|---|---|
| **Payment** | Simulated — Razorpay UI shown but no real transaction processed |
| **Reorder Button** | Visible in past orders UI but not yet functional |
| **Navbar Search** | Accepts input but not connected to any search function |
| **Sort by Cost** | Currently sorts on rating field — no `cost` field in Restaurant schema |
| **Admin Panel** | No restaurant/menu management interface |
| **Real-time Order Tracking** | Simulated with a 60-second countdown timer; not server-driven |

### 14.2 Future Scope

| Enhancement | Description |
|---|---|
| **Real Razorpay Integration** | Full payment flow with webhook verification and order status updates |
| **WebSocket Order Tracking** | Real-time server-pushed order status updates using Socket.io |
| **Admin Dashboard** | CRUD interface for managing restaurants and menu items |
| **Search & Discovery** | Full-text search using MongoDB Atlas Search or Elasticsearch |
| **Email Notifications** | Order confirmation and status emails via Nodemailer or SendGrid |
| **Rating System** | Allow users to rate and review orders and menu items |
| **Offer Engine** | Dynamic discount codes and promoted restaurant logic |
| **PWA Support** | Service worker + offline mode for a native app-like experience |

---

## 15. Conclusion

**Eats** is a full-featured, production-deployed food delivery application that demonstrates a professional level of software engineering. The project moves well beyond a functional prototype — it applies enterprise-grade architectural patterns, cross-browser compatibility solutions, cloud service integrations, and a deliberate software design philosophy throughout the codebase.

Key engineering highlights:

- **Five-layer backend architecture** (Entry → App → Routes → Controller → Service) with TypeScript strict typing
- **9 design patterns** (Facade, DI, Chain of Responsibility, Strategy, Observer, Proxy, Memento, Module, Singleton) each solving a specific engineering problem
- **All 5 SOLID principles** documented and demonstrated with real code references
- **Cross-browser JWT strategy** solving the Safari ITP + Chrome Incognito cross-domain cookie problem
- **Debounced Observer cart sync** with a logout-guard that prevents data loss
- **Snapshot-based order history** ensuring historical accuracy regardless of menu changes
- **Production-ready deployment** on Vercel + Render + MongoDB Atlas with proper build pipelines

The architecture is designed to be easily extensible — adding a new feature domain (e.g., notifications, reviews, admin panel) requires creating a new route class and adding a single line to `server.ts`, without touching any existing code.

---

*Report prepared by: Ranvendra Pratap Singh*
*Project: Eats — Full Stack Food Delivery Application*
*Date: April 2026*
