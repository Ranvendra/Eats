# 🍔 Eats — Full Project Documentation
### (Simple Hinglish mein — Ranvendra ke liye)

---

## 📌 Project Kya Hai?

**Eats** ek food delivery web application hai — bilkul Swiggy / Zomato jaisi.  
Isme user:
- Restaurants browse kar sakta hai
- Menu dekh sakta hai
- Cart mein items add kar sakta hai
- Razorpay se payment kar sakta hai
- Orders track kar sakta hai
- Profile update kar sakta hai (photo ke saath)

**Tech Stack:**
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit, Axios |
| Backend | Node.js + Express, **TypeScript**, MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| File Upload | Multer + Cloudinary |
| Payment | Razorpay |
| Deployment | Vercel (client) + Render (server) |

---

## 🗂️ Project Structure — Ek Nazar Mein

```
Eats/
├── client/          ← React Frontend (Vite + JSX)
│   └── src/
│       ├── api/         ← Axios instance + API calls
│       ├── utils/       ← Redux Store, Slices
│       ├── HomePage/    ← Home page components
│       ├── Restaurants/ ← Restaurant listing + menu
│       ├── Cart/        ← Cart UI
│       ├── Orders/      ← Order history
│       ├── Profile/     ← User profile
│       └── authPage/    ← Login / Signup
│
└── server/          ← Express Backend (TypeScript + OOP)
    └── src/
        ├── server.ts       ← Entry point — App ko boot karta hai
        ├── app.ts          ← App class — sab kuch orchestrate karta hai
        ├── routes/         ← Route classes (AuthRoutes, CartRoutes, etc.)
        ├── controllers/    ← Controller classes (business logic ka gateway)
        ├── services/       ← Service classes (actual business logic)
        ├── models/         ← Mongoose models + TypeScript interfaces
        ├── middlewares/    ← userAuth middleware
        ├── config/         ← Cloudinary + Multer config
        └── utils/          ← route.interface.ts + validation.ts
```

---

## ⚙️ Backend Architecture — Deep Dive

Backend mein **Layered Architecture** follow kiya gaya hai:

```
HTTP Request
    ↓
Route Class  (URL mapping + middleware attach)
    ↓
Controller Class  (Request handle karo, validate karo)
    ↓
Service Class  (Pure business logic)
    ↓
Mongoose Model  (Database interaction)
    ↓
MongoDB
```

Ye pattern **separation of concerns** ensure karta hai — har layer ka ek hi kaam hai.

---

## 🏛️ SOLID Principles — Kahan Aur Kaise Laagu Hai

SOLID 5 principles hain. Chaliye ek ek dekhtey hain — real code ke saath.

---

### 1️⃣ S — Single Responsibility Principle (SRP)

> **"Ek class ka sirf ek hi kaam hona chahiye."**

#### ✅ `AuthController` — Sirf HTTP handle karna

```typescript
// auth.controller.ts
class AuthController {
  private authService = new AuthService();

  public handleSignup = async (req, res) => { ... }
  public handleLogin = async (req, res) => { ... }
  public handleLogout = (req, res) => { ... }
  public handleProfile = async (req, res) => { ... }
}
```

`AuthController` ka **sirf ek kaam** hai: HTTP request lena, data nikalna, aur response dena.  
Ye khud **koi business logic nahi karta** — sab kuch `AuthService` ko deta hai.

#### ✅ `AuthService` — Sirf Business Logic

```typescript
// auth.service.ts
class AuthService {
  public async signupUser(userData: any) {
    // User create karo — bas yahi kaam
  }

  public async loginUser(identifier: string, passwordInput: string) {
    // User dhundho, password check karo, token do — bas yahi kaam
  }
}
```

`AuthService` ko HTTP request ya response ke baare mein kuch bhi pata nahi.  
Uska ek hi kaam hai: **auth logic execute karna**.

#### ✅ `validation.ts` — Sirf Validation

```typescript
// utils/validation.ts
export const validateSignUpData = (req: Request) => { ... }
export const validateLoginData = (req: Request) => { ... }
```

Validation logic controller ke andar nahi daali — **alag file mein** rakhi, taaki ek hi jagah se manage ho sake.

#### ✅ `cloudinary.ts` / `multer.ts` — Sirf Config

Cloudinary ka setup alag file mein, Multer ka alag. Ek file ek kaam.

---

#### 🔴 SRP Violation Kaise Hoti? (Example ke liye)

Agar hum ye karte:
```typescript
// BAD — AuthController khud sab kar raha hai
class AuthController {
  public handleSignup = async (req, res) => {
    // validate bhi yahan
    // DB query bhi yahan
    // token bhi yahan
    // email bhi yahan
  }
}
```
Yahan controller ki **4 responsibilities** ho gayi — yahi SRP violation hai.

---

### 2️⃣ O — Open/Closed Principle (OCP)

> **"Class extension ke liye open honi chahiye, modification ke liye closed."**

#### ✅ `Routes` Interface + `App` Class

```typescript
// utils/route.interface.ts
export interface Routes {
  path?: string;
  router: Router;
}
```

```typescript
// app.ts
class App {
  constructor(routes: Routes[]) {
    this.initializeRoutes(routes);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
}
```

`App` class ko **koi change nahi** karna padta jab naya route add karo.

```typescript
// server.ts — Naya route add karna itna simple hai:
const app = new App([
  new AuthRoutes(),
  new CartRoutes(),
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes(),
  // new NotificationRoutes(), // Bas yahan add karo! App.ts touch nahi karna
]);
```

**App class closed hai modification ke liye** (uski `initializeRoutes` method change nahi hui) lekin **open hai extension ke liye** (naya `Routes` implement karna aur pass karna kaafi hai).

---

### 3️⃣ L — Liskov Substitution Principle (LSP)

> **"Agar B, A ka subtype hai — toh A ki jagah B rakh do — program sahi chalna chahiye."**

#### ✅ Har Route Class `Routes` Interface implement karti hai

```typescript
class AuthRoutes implements Routes {
  public path = "/api/v1/auth";
  public router = Router();
}

class CartRoutes implements Routes {
  public path = "/api/v1/cart";
  public router = Router();
}

class OrderRoutes implements Routes {
  public path = "/api/v1/orders";
  public router = Router();
}
```

`App` class ko `Routes[]` milta hai. Chahe `AuthRoutes` ho, `CartRoutes` ho ya `PaymentRoutes` —  
**sab ek jaisa behave karte hain**.

`App.initializeRoutes()` hamesha correctly kaam karega kyunki sab classes same contract follow karti hain.

---

### 4️⃣ I — Interface Segregation Principle (ISP)

> **"Class ko sirf woh methods implement karne chahiye jo usse chahiye — bekar methods force mat karo."**

#### ✅ `Routes` Interface — Minimal aur Focused

```typescript
// route.interface.ts
export interface Routes {
  path?: string;   // Optional
  router: Router;  // Required — yahi toh kaam hai
}
```

Interface **chhota aur focused** hai — sirf 2 fields.  
Agar isme `connectDB()`, `startServer()` jaisi methods hoti, toh har route class ko unhe implement karna padta — jo ISP violation hota.

#### ✅ Mongoose TypeScript Interfaces — Model-specific

```typescript
// models/User.ts
export interface IUser extends Document {
  validatePassword(passwordInput: string): Promise<boolean>;
  getJWT(): string;
  // ... sirf User ke fields
}

// models/Cart.ts
export interface ICartItem { ... }  // Cart item ke fields
export interface ICart extends Document { ... }  // Cart ke fields — User ke nahi

// models/Order.ts
export type OrderStatus = "CREATED" | "ACCEPTED" | "PREPARING" | ...
export interface IOrder extends Document { ... }  // Order specific
```

Har model ka **apna interface** hai — koi ek "God Interface" nahi banaya jisme sab kuch ho.

---

### 5️⃣ D — Dependency Inversion Principle (DIP)

> **"High-level modules ko low-level modules pe directly depend nahi karna chahiye — dono ko abstraction pe depend karna chahiye."**

#### ✅ `App` class Routes Interface pe depend karti hai, concrete classes pe nahi

```typescript
// app.ts — HIGH LEVEL MODULE
class App {
  constructor(routes: Routes[]) {  // Interface pe depend karta hai, actual class pe nahi
    this.initializeRoutes(routes);
  }
}
```

```typescript
// server.ts
const app = new App([
  new AuthRoutes(),    // Concrete implementation inject ki ja rahi hai
  new CartRoutes(),
]);
```

`App` class `AuthRoutes` ya `CartRoutes` ke baare mein directly nahi jaanti —  
woh sirf `Routes` interface jaanti hai. Ye classic **Dependency Injection** pattern hai.

#### ✅ `AuthController` mein `AuthService` inject kiya

```typescript
class AuthController {
  private authService = new AuthService(); // Service inject ki gayi hai
  // Controller ko AuthService ki internal implementation nahi pata
}
```

Controller sirf service ka **public interface** (methods) use karta hai — internal implementation chahe kuch bhi ho.

---

## 🔷 TypeScript + OOP — System Design Concepts

### 📦 Class-based Architecture

Pura backend **class-based** hai — functions nahi, classes.

| File | Class | Role |
|---|---|---|
| `app.ts` | `App` | Server bootstrapping |
| `auth.routes.ts` | `AuthRoutes` | Route definitions |
| `auth.controller.ts` | `AuthController` | HTTP handler |
| `auth.service.ts` | `AuthService` | Business logic |
| `cart.controller.ts` | `CartController` | Cart HTTP handler |
| `order.controller.ts` | `OrderController` | Order HTTP handler |
| `payment.controller.ts` | `PaymentController` | Payment HTTP handler |
| `restaurant.controller.ts` | `RestaurantController` | Restaurant HTTP handler |

### 🔒 Access Modifiers (TypeScript OOP — Encapsulation)

```typescript
class App {
  public app: express.Application;    // Bahar se accessible
  public port: string | number;       // Bahar se accessible

  public startServer() { ... }               // Public — server.ts se call hoga

  private initializeRoutes(...) { ... }      // Private — sirf App ke andar
  private initializeMiddlewares() { ... }    // Private — sirf App ke andar
  private async connectDatabase() { ... }    // Private — sirf App ke andar
}
```

`private` — andar ka implementation hide karta hai.  
`public` — bahar se jo accessible hai wahi expose karo.

Ye **Encapsulation** ka concept hai — OOP ka core pillar.

### 🧱 TypeScript Interfaces (Mongoose ke saath)

```typescript
// Mongoose models ke liye TypeScript interfaces
export interface IUser extends Document {
  userName: string;
  userEmail: string;
  validatePassword(passwordInput: string): Promise<boolean>;
  getJWT(): string;
}

export interface IOrder extends Document {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}
```

Interface **contract** define karti hai — TypeScript ensure karta hai ki Mongoose model us contract ko follow kare.

### 🏷️ TypeScript Type Aliases — Type Safety

```typescript
// models/Order.ts
export type OrderStatus = "CREATED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
```

Ab koi bhi `orderStatus` mein galat value set nahi kar sakta —  
TypeScript compile time pe hi pakad lega. Runtime bug nahi hoga.

### 🔗 TypeScript Generics — Type-safe Schemas

```typescript
// Generics use karke type-safe schemas
const userSchema = new Schema<IUser>({ ... });
const cartSchema = new Schema<ICart>({ ... });
const orderSchema = new Schema<IOrder>({ ... });

// Return type bhi typed hai
export default mongoose.model<IUser>("User", userSchema);
```

`Schema<IUser>` — TypeScript ki **Generic** feature se schema aur interface sync rehte hain.  
Ek baar interface change karo, schema automatically type-check ho jaata hai.

### 🔌 `implements` keyword — Contract Enforcement

```typescript
class AuthRoutes implements Routes {
  // TypeScript ensure karta hai ki Routes interface ke sab fields yahan hain
  public router = Router();
  // Agar router nahi hota — TypeScript error deta
}
```

---

## 🗄️ Database Design — MongoDB Indexing Strategy

Sirf data store nahi kiya, **query optimization** bhi ki gayi hai:

```typescript
// Restaurant — City + Cuisine pe compound index
restaurantSchema.index({ restaurantCity: 1, restaurantCuisine: 1 });

// MenuItem — Restaurant ke saath Category pe index
menuItemSchema.index({ restaurantId: 1, menuItemCategory: 1 });

// Order — User ki history efficiently fetch karne ke liye (latest first)
orderSchema.index({ userId: 1, createdAt: -1 });
```

### Data Snapshot Pattern (Order mein)

```typescript
// orderItemSchema mein:
itemName: { type: String, required: true },
// Snapshot at order time — historical accuracy even if menu changes later
```

Matlab: Agar restaurant ne baad mein menu item ka naam change kar diya,  
purana order tab bhi sahi naam dikhayega — kyunki hum **snapshot** store karte hain.

---

## 🔐 Authentication Flow

```
Client                         Server
  |                               |
  |-- POST /api/v1/auth/login --> |
  |                               |-- validateLoginData()
  |                               |-- AuthService.loginUser()
  |                               |-- User.validatePassword() [bcrypt]
  |                               |-- User.getJWT() [jsonwebtoken]
  |<-- { token, userData } ------ |
  |                               |
  | [localStorage mein token]     |
  |                               |
  |-- GET /api/v1/auth/profile -> |
  |   Authorization: Bearer <tok> |
  |                               |-- userAuth middleware
  |                               |-- jwt.verify()
  |                               |-- User.findById()
  |                               |-- req.user = user
  |<-- { userInfo } ------------- |
```

### Cross-Browser Fix (Safari + Chrome problem solve kiya)

Third-party cookies ka Safari/Chrome mein block hone ki samasya thi (cross-domain Vercel → Render).  
Solution: **Dual strategy** — Cookie fallback + Authorization header primary.

```javascript
// axiosInstance.js — Client side: Har request pe token header mein add karo
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eats_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
```

```typescript
// userAuth.ts — Server side: Header pehle dekho, cookie baad mein
const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer ")) {
  token = authHeader.split(" ")[1];  // Primary: Bearer Header
} else {
  token = req.cookies?.token;         // Fallback: Cookie
}
```

---

## 🛒 Cart Architecture — Debounced DB Sync

Cart **Redux mein** hai (in-memory), aur Backend DB mein bhi save hoti hai.

```javascript
// appStore.js — Debounced sync
appStore.subscribe(() => {
  if (isAuthenticated && cart?.isHydrated) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      axiosInstance.post('/api/v1/cart/sync', cart); // 1 second baad DB mein save
    }, 1000);
  }
});
```

**Debounce** isliye: Agar user rapidly +/- kare, har click pe DB call nahi hogi —  
sirf **1 second ruk ke** ek call hogi. DB spam se bachta hai.

### Logout pe Cart Erasure Bug Fix

```javascript
// CRITICAL FIX: Logout pe empty cart DB mein save mat karo
if (previousAuthState === true && isAuthenticated === false) {
  previousAuthState = false;
  clearTimeout(syncTimeout);
  return; // Bail out — logout ke waqt sync skip karo
}
```

### `isHydrated` Flag

```javascript
isHydrated: false, // Initial state — DB se load nahi hua
loadCart: (_state, action) => {
  return { ...action.payload, isHydrated: true }; // DB se load hone ke baad true
}
```

Ye ensure karta hai ki empty cart accidentally DB mein save na ho.

---

## 🏗️ Frontend Architecture — React + Redux

### State Management

```
Redux Store (appStore.js)
├── user slice     ← Login/Logout state, user info
├── cart slice     ← Items, quantity, amount
└── restaurant slice ← Restaurant list
```

### API Layer — SRP Frontend pe bhi

```javascript
// axiosInstance.js — Single configured instance (ek jagah config)
const axiosInstance = axios.create({
  baseURL,           // Dev/Prod URL auto-detect
  withCredentials: true,
});

// authApi.js — Grouped auth API calls (ek jagah sab auth calls)
export const authApi = {
  signup: async (userData) => { ... },
  login:  async (credentials) => { ... },
  logout: async () => { ... },
  getProfile: async () => { ... },
  updateProfile: async (formData) => { ... },
};
```

API calls ek jagah grouped hain — component mein directly `axios.post(...)` nahi likha —  
**Single Responsibility** frontend pe bhi follow ki.

---

## 📤 File Upload Flow (Profile Picture)

```
Client                               Server
  |                                    |
  |--- PUT /api/v1/auth/profile -----→ |
  |    (FormData with image)           |
  |                                    |-- Multer (memoryStorage — disk pe nahi)
  |                                    |-- uploadToCloudinary(req.file.buffer)
  |                                    |-- Cloudinary pe upload (face crop, 400x400)
  |                                    |-- User DB update (profilePicture URL)
  |←-- { updatedUser } -------------- |
```

```typescript
// config/multer.ts — Memory mein rakho (disk nahi — Render ephemeral storage hai)
const storage = multer.memoryStorage();

// config/cloudinary.ts — Buffer se stream banake Cloudinary pe bhejo
const stream = cloudinary.uploader.upload_stream(..., callback);
streamifier.createReadStream(fileBuffer).pipe(stream);
```

---

## 💳 Payment Flow (Razorpay)

```
Client                              Server
  |                                   |
  |-- POST /payment/create-order -->  |
  |   { amount }                      |-- Razorpay instance create
  |                                   |-- order create (amount*100, INR)
  |<-- { order_id, amount } --------  |
  |                                   |
  | [Razorpay SDK — Browser popup]    |
  |                                   |
  |-- POST /payment/verify-payment -> |
  |   { order_id, payment_id, sig }   |-- HMAC SHA256 signature verify
  |<-- { success: true } -----------  |
```

---

## 📋 API Endpoints Summary

### Auth (`/api/v1/auth`)
| Method | Endpoint | Middleware | Description |
|---|---|---|---|
| POST | `/signup` | — | Naya user banao |
| POST | `/login` | — | Login karo |
| POST | `/logout` | — | Logout karo |
| GET | `/profile` | userAuth | Profile fetch karo |
| PUT | `/profile` | userAuth + multer | Profile update karo |

### Restaurants (`/api/v1/restaurants`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Sab restaurants (paginated) |
| GET | `/:resId` | Ek restaurant ki details |
| GET | `/:resId/menu` | Restaurant ka menu |

### Cart (`/api/v1/cart`)
| Method | Endpoint | Middleware | Description |
|---|---|---|---|
| GET | `/` | userAuth | Cart fetch karo |
| POST | `/sync` | userAuth | Cart DB mein save karo |
| DELETE | `/` | userAuth | Cart clear karo |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Middleware | Description |
|---|---|---|---|
| POST | `/` | userAuth | Order place karo |
| GET | `/` | userAuth | Order history |
| PATCH | `/:id/status` | userAuth | Status update karo |

### Payment (`/api/v1/payment`)
| Method | Endpoint | Middleware | Description |
|---|---|---|---|
| POST | `/create-order` | userAuth | Razorpay order banao |
| POST | `/verify-payment` | userAuth | Payment verify karo |

---

## ✅ SOLID Summary — Quick Reference Table

| Principle | Kahan Laagu Hai | Kaise |
|---|---|---|
| **S** — Single Responsibility | `AuthController`, `AuthService`, `validation.ts`, `cloudinary.ts`, `multer.ts` | Har class/file ka ek hi kaam — HTTP handle ya business logic ya config |
| **O** — Open/Closed | `App` class + `Routes` interface | Naya route add karo bina App.ts modify kiye |
| **L** — Liskov Substitution | `AuthRoutes`, `CartRoutes`, `OrderRoutes` etc. (sab `Routes` implement karte hain) | App class kisi bhi Routes subtype ko safely use kar sakti hai |
| **I** — Interface Segregation | `Routes` interface (sirf 2 fields), `IUser`, `ICart`, `IOrder` (alag-alag) | Koi "God Interface" nahi — minimal contracts |
| **D** — Dependency Inversion | `App` constructor mein `Routes[]` injection, `AuthController` mein `AuthService` | High-level modules abstraction pe depend karte hain, concrete pe nahi |

---

## 🎯 OOP + TypeScript Concepts — Quick Reference

| Concept | Kahan Use Hua |
|---|---|
| **Classes** | App, AuthController, AuthService, AuthRoutes, CartController, etc. |
| **Interfaces** | Routes, IUser, ICart, IOrder, IMenuItem, IRestaurant |
| **Access Modifiers** | `public`, `private` — App class ke methods |
| **Constructor Injection (DI)** | `new App([new AuthRoutes(), ...])` |
| **Encapsulation** | `private initializeRoutes()`, `private connectDatabase()` |
| **TypeScript Generics** | `Schema<IUser>`, `model<IUser>()` |
| **Type Aliases / Union Types** | `OrderStatus`, `PaymentStatus` |
| **implements keyword** | `class AuthRoutes implements Routes` |
| **Layered Architecture** | Route → Controller → Service → Model |
| **Data Snapshot Pattern** | Order mein item name/price store at time of order |

---

*Documentation last updated: April 2026*  
*Project: Eats Food Delivery App*
