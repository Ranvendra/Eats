# 🎨 Design Patterns — Eats Project Documentation
### (Simple Hinglish mein)

> Design Patterns **proven solutions** hain common software problems ke liye.  
> Yahan dekho Eats project mein **kahan aur kaise** ye patterns naturally apply hue hain — real code ke saath.

---

## 📍 Quick Map — Ek Nazar Mein

| Pattern | Category | File(s) |
|---|---|---|
| **Facade** | Structural | `server/src/app.ts` |
| **Dependency Injection** | Creational / Behavioral | `server/src/server.ts`, `controllers/auth.controller.ts` |
| **Chain of Responsibility** | Behavioral | `middlewares/userAuth.ts`, all `routes/*.ts` |
| **Strategy** | Behavioral | `middlewares/userAuth.ts`, `client/api/axiosInstance.js` |
| **Observer** | Behavioral | `client/src/utils/appStore.js` |
| **Proxy** | Structural | `client/src/api/axiosInstance.js` |
| **Memento / Snapshot** | Behavioral | `models/Order.ts`, `controllers/order.controller.ts` |
| **Module** | Structural | `client/src/api/authApi.js` |
| **Singleton** | Creational | `axiosInstance.js`, `appStore.js`, Mongoose connection |

---

## 1️⃣ Facade Pattern

> ### "Complex system ke upar ek **simple interface** rakho."
> User ko andar ki complexity dikhani zaroori nahi — bas kaam ka interface do.

📁 **File:** `server/src/app.ts` + `server/src/server.ts`

### Problem Tha:
Express server start karne ke liye bahut kaam hota hai:
- Middleware lagao (cors, cookieParser, json)
- Sab routes register karo
- MongoDB se connect karo
- Port pe listen karo

Itna sab `server.ts` mein karna messy hota.

### Solution — `App` class Facade hai:
```typescript
// app.ts — Andar sab complexity hai
class App {
  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.initializeMiddlewares();   // ← complex kaam 1
    this.initializeRoutes(routes);  // ← complex kaam 2
    this.connectDatabase();         // ← complex kaam 3
  }

  public startServer() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on http://localhost:${this.port}`);
    });
  }

  private initializeMiddlewares() { /* cors, cookieParser, json... */ }
  private initializeRoutes(routes) { /* routes loop */ }
  private async connectDatabase() { /* mongoose connect */ }
}
```

```typescript
// server.ts — Bahar sirf itna dikhta hai! (Facade ka fayda)
const app = new App([
  new AuthRoutes(),
  new CartRoutes(),
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes(),
]);

app.startServer();
// 2 lines mein poora server — andar kya ho raha hai pata nahi
```

### Fayda:
- `server.ts` clean aur readable hai
- App ki internal wiring change karo — `server.ts` untouched
- Naya middleware logically ek jagah (`initializeMiddlewares`) mein

---

## 2️⃣ Dependency Injection (DI) Pattern

> ### "Cheezein bahar se **inject karo** — andar hardcode mat karo."
> Class ko apni dependencies khud create nahi karni chahiye — bahar se milni chahiye.

📁 **Files:** `server/src/server.ts` → `app.ts` | `controllers/auth.controller.ts`

### Example 1 — Routes inject ho rahi hain `App` mein:

```typescript
// server.ts — COMPOSITION ROOT (yahan sab inject hota hai)
const app = new App([          // ← App ko Routes inject ho rahi hain
  new AuthRoutes(),
  new CartRoutes(),
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes(),
]);
```

```typescript
// app.ts — App class khud koi route nahi banati
class App {
  constructor(routes: Routes[]) {  // ← Bahar se milte hain
    this.initializeRoutes(routes);
  }
}
```

`App` class ne `new AuthRoutes()` andar nahi likha — bahar se inject hua. Kal agar `AuthRoutes` ka naam badal do ya replace karo — `App.ts` untouched.

### Example 2 — `AuthService` inject in `AuthController`:

```typescript
// auth.controller.ts
class AuthController {
  private authService = new AuthService(); // ← AuthService inject ki gayi

  public handleLogin = async (req, res) => {
    // Controller ko AuthService ka andar ka implementation nahi pata
    const { user, token } = await this.authService.loginUser(identifier, password);
    res.json({ data: user, token });
  };
}
```

Kal agar `AuthService` ki `loginUser()` method ki implementation change ho (e.g., OAuth add karo) — `AuthController` ka code same rahega.

### Fayda:
- Loosely coupled code
- Testing mein mock inject kar sakte ho
- Implementation change karo — dependent class untouched

---

## 3️⃣ Chain of Responsibility Pattern

> ### "Request ek **chain** se guzarti hai — har link apna kaam kare, phir aage bheje."
> Koi link fail ho → chain rok do. Pass ho → `next()` se aage.

📁 **Files:** `middlewares/userAuth.ts` + sab `routes/*.ts` files

### Express Middleware Chain:

```typescript
// auth.routes.ts — Teen handlers ki chain
this.router.put(
  `${this.path}/profile`,
  userAuth,                                      // Link 1: JWT verify karo
  upload.single("profilePicture"),               // Link 2: File process karo
  this.authController.handleProfileUpdate        // Link 3: Profile update karo
);

// cart.routes.ts — Do handlers ki chain
this.router.get(
  `${this.path}/`,
  userAuth,                           // Link 1: Auth check
  this.cartController.getCart         // Link 2: Cart do
);

// order.routes.ts
this.router.post(
  `${this.path}/`,
  userAuth,                            // Link 1: Auth check
  this.orderController.placeOrder      // Link 2: Order place karo
);
```

```typescript
// middlewares/userAuth.ts — Chain ka ek link
export const userAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = /* nikalo */;
    if (!token) throw new Error("Please Login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();  // ← Chain aage bhejo — next handler ko call karo
  } catch (err) {
    res.status(401).json({ message: err.message });
    // ↑ Chain rok do — next() call nahi hua
  }
};
```

### Flow Diagram:
```
Request aaya
    ↓
userAuth middleware
    ↓ (fail?) → 401 Unauthorized — chain STOP
    ↓ (pass?) → next() — aage bhejo
    ↓
upload middleware (agar file route hai)
    ↓ (fail?) → Error — chain STOP
    ↓ (pass?) → next()
    ↓
Controller handler — actual response bhejo
```

### Fayda:
- Auth logic ek hi jagah — har route dobara nahi likhna
- Middleware order matter karta hai — intentional sequencing
- Har link independent — test alag se ho sakta hai

---

## 4️⃣ Strategy Pattern

> ### "Kaam karne ka **tarika runtime pe choose karo** — hardcode mat karo."
> Different strategies — ek common interface se.

📁 **Files:** `middlewares/userAuth.ts` | `client/api/axiosInstance.js`

### Backend — Token Extraction Strategy:

```typescript
// userAuth.ts — Runtime pe strategy decide hoti hai
let token: string | undefined;

const authHeader = req.headers.authorization;

if (authHeader && authHeader.startsWith("Bearer ")) {
  token = authHeader.split(" ")[1];  // ← Strategy A: Authorization Header se nikalo
} else {
  token = req.cookies?.token;         // ← Strategy B: Cookie se nikalo
}
```

**Kyun?** Safari aur Chrome cross-domain cookies block karte hain (Vercel → Render).  
- Modern browsers: Bearer token header use karo
- Old/compatible browsers: Cookie fallback

### Frontend — Token Sending Strategy:

```typescript
// axiosInstance.js — Interceptor decide karta hai kaise token bhejein
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eats_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // ← Strategy: Header mein bhejo
  }
  return config;
  // Agar token nahi — withCredentials: true se cookie automatically jayegi (fallback)
});
```

### Fayda:
- Cross-browser compatibility fix hua
- Dono strategies ek saath kaam karti hain
- Naya strategy add karna easy — sirf ek aur `else if`

---

## 5️⃣ Observer Pattern

> ### "Jab **state badle**, registered observers automatically **react karen**."
> Subscribe karo — change aane pe notify ho jao.

📁 **File:** `client/src/utils/appStore.js`

### Cart Auto-Sync — Redux Observer:

```typescript
// appStore.js
let syncTimeout;
let previousAuthState = false;

appStore.subscribe(() => {             // ← Observer register kiya
  const state = appStore.getState();
  const isAuthenticated = state.user?.isAuthenticated;
  const cart = state.cart;

  // Edge case: Logout pe empty cart DB mein mat save karo
  if (previousAuthState === true && isAuthenticated === false) {
    previousAuthState = false;
    clearTimeout(syncTimeout);
    return;
  }
  previousAuthState = isAuthenticated;

  // Jab bhi cart change ho aur user logged in ho — DB mein sync karo
  if (isAuthenticated && cart?.isHydrated) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {        // ← Debounced Observer reaction
      axiosInstance.post('/api/v1/cart/sync', cart).catch(console.error);
    }, 1000);
  }
});
```

### Flow:
```
User ne cart mein item add kiya
    ↓
Redux state change hua
    ↓
appStore.subscribe() ka callback fire hua  (Observer notified)
    ↓
Debounce: 1 second wait karo (spam prevent)
    ↓
POST /api/v1/cart/sync  (DB mein save)
```

### Redux Components bhi Observers hain:
```javascript
// Koi bhi component useSelector se store observe karta hai
const cart = useSelector((store) => store.cart);
// Cart state change hote hi component automatically re-render hota hai
// Ye bhi Observer pattern hai — React/Redux ka built-in
```

### Fayda:
- Cart changes automatically DB mein save hoti hain — manually kuch nahi karna
- Debounce se DB spam nahi hota
- Logout bug fix — observer intelligently handle karta hai

---

## 6️⃣ Proxy Pattern

> ### "Original object ke aage ek **gatekeeper** rakho — extra behavior add karo."
> Client ko pata bhi nahi chalta ki proxy ke through ja raha hai.

📁 **File:** `client/src/api/axiosInstance.js`

### `axiosInstance` — Axios ka Proxy:

```typescript
// axiosInstance.js
import axios from "axios";

const baseURL = import.meta.env.MODE === "development"
  ? (import.meta.env.VITE_LOCAL_BACKEND_URL || "http://localhost:5001")
  : import.meta.env.VITE_BACKEND_URL;

// Proxy banaya — real axios ka controlled version
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Proxy ka extra behavior: JWT auto-inject
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eats_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
```

```javascript
// authApi.js — Direct axios nahi, proxy use karta hai
import axiosInstance from "./axiosInstance";

export const authApi = {
  getProfile: async () => {
    const response = await axiosInstance.get("/api/v1/auth/profile");
    // ↑ authApi ko pata nahi ki JWT automatically attach ho raha hai
    // Proxy ne transparently handle kar liya
    return response.data;
  },
};
```

### Diagram:
```
Component calls authApi.getProfile()
    ↓
authApi calls axiosInstance.get()   ← PROXY
    ↓
Interceptor: JWT token attach karo
    ↓
Real HTTP request goes to server
```

### Fayda:
- Har API call mein manually token nahi lagana
- BaseURL ek jagah — dev/prod auto switch
- Proxy change karo — sab API calls update ho jaati hain

---

## 7️⃣ Memento / Snapshot Pattern

> ### "Object ka **ek waqt ka state capture** karo — baad mein restore kar sako ya reference de sako."
> Order ke waqt ka menu = snapshot. Menu baad mein change ho — order same rahe.

📁 **Files:** `models/Order.ts` + `controllers/order.controller.ts`

### Problem:
Restaurant ne 3 months baad item ka naam "Paneer Butter Masala" se "PBM Special" kar diya.  
Ab purane orders mein naya naam dikhega — **historical accuracy khatam**.

### Solution — Snapshot at Order Time:

```typescript
// order.controller.ts — Order place karte waqt SNAPSHOT lo
const enrichedItems = await Promise.all(
  orderItems.map(async (item) => {
    const menuItemDoc = await MenuItem.findById(item.menuItemId);
    return {
      menuItemId: item.menuItemId,
      itemName: menuItemDoc?.menuItemName || item.itemName,   // ← SNAPSHOT: naam abhi ka
      itemPrice: item.itemPrice,                               // ← SNAPSHOT: price abhi ka
      itemQuantity: item.itemQuantity,
      isVeg: menuItemDoc?.isMenuItemVeg ?? item.isVeg ?? true,
    };
  })
);

const newOrder = new Order({
  orderItems: enrichedItems,  // ← Snapshot DB mein save ho gaya
  // ...
});
```

```typescript
// models/Order.ts — Schema mein snapshot fields required hain
const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: ObjectId, ref: "MenuItem", required: true },
  itemName:  { type: String, required: true },   // ← Snapshot stored
  itemPrice: { type: Number, required: true },   // ← Snapshot stored
  itemQuantity: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
}, { _id: false });
```

### Flow:
```
User ne order diya (2024 mein)
    ↓
Item name: "Paneer Butter Masala", Price: ₹280  — SNAPSHOT saved in Order
    ↓
Restaurant ne 2025 mein naam badla: "PBM Special", Price: ₹320
    ↓
2024 ka order dekhne gaye
    ↓
Still shows: "Paneer Butter Masala" — ₹280  ✅ (Snapshot preserved)
```

### Fayda:
- Order history hamesha accurate
- Menu changes purane orders ko affect nahi karte
- Legal/billing accuracy maintain hoti hai

---

## 8️⃣ Module Pattern

> ### "Related cheezein **ek object mein group karo** — clean public API do."
> Implementation andar chhupao — bahar sirf interface do.

📁 **File:** `client/src/api/authApi.js`

```javascript
// authApi.js — Ek module, sab auth API calls grouped
const TOKEN_KEY = "eats_token";  // ← Private detail — bahar nahi jaati

export const authApi = {

  signup: async (userData) => {
    const response = await axiosInstance.post("/api/v1/auth/signup", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/api/v1/auth/login", credentials);
    const { token } = response.data;
    if (token) localStorage.setItem(TOKEN_KEY, token);  // ← Implementation detail hidden
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);                 // ← Hidden internal step
    const response = await axiosInstance.post("/api/v1/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/api/v1/auth/profile");
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await axiosInstance.put("/api/v1/auth/profile", formData);
    return response.data;
  },
};
```

```javascript
// Component mein usage — kitna clean!
import { authApi } from "../api/authApi";

// Component ko pata nahi:
// - localStorage kis key pe save hota hai
// - Token kaise attach hota hai
// - Error handling kaise hoti hai
// Sirf yahi jaanta hai:
await authApi.login({ identifier, password });
await authApi.logout();
```

### Fayda:
- Components clean rehte hain — API details nahi pata
- `TOKEN_KEY` ek jagah — change karna ho toh sirf `authApi.js` mein
- Sab auth-related logic ek file mein — easy to find, easy to change

---

## 9️⃣ Singleton Pattern

> ### "Puri application mein sirf **ek hi instance** hona chahiye."
> Baar baar naya object banana wasteful hai — ek hi banao, sab share karo.

📁 **Files:** `client/api/axiosInstance.js` | `client/utils/appStore.js` | `server/src/app.ts`

### Singleton 1 — `axiosInstance`:

```javascript
// axiosInstance.js — Ek baar create hua
const axiosInstance = axios.create({ baseURL, withCredentials: true });
export default axiosInstance;

// authApi.js
import axiosInstance from "./axiosInstance";  // ← Same instance

// appStore.js
import axiosInstance from "../api/axiosInstance";  // ← Same instance

// Poori app mein same axiosInstance — naya create nahi hota kabhi
```

### Singleton 2 — Redux Store:

```javascript
// appStore.js
const appStore = configureStore({
  reducer: { restaurants, cart, user }
});
export default appStore;

// main.jsx
import appStore from "./utils/appStore";
<Provider store={appStore}>  // ← Ek instance poori app ko milta hai
  <App />
</Provider>
```

### Singleton 3 — MongoDB Connection (Backend):

```typescript
// app.ts — Sirf ek baar connect karo
private async connectDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await connect(uri);  // ← Mongoose internally connection pool maintain karta hai
  // Singleton connection — har request pe naya connection nahi banta
}
```

### Singleton 4 — `App` server instance:

```typescript
// server.ts
const app = new App([...]);  // ← Ek hi App instance banaya
app.startServer();
// Puri lifetime mein sirf ek App instance — Singleton
```

### Fayda:
- Memory efficient — baar baar naya object nahi banta
- Consistent state — sab ek hi instance share karte hain
- DB connection pool reuse — performance better

---

## 📊 Final Summary Table

| Pattern | Category | Kahan | Kya Problem Solve Kiya |
|---|---|---|---|
| **Facade** | Structural | `app.ts` | Express setup ki complexity `server.ts` se hide ki |
| **Dependency Injection** | Behavioral | `server.ts` → `app.ts`, `AuthController` | Tight coupling hataya, extensibility badhaya |
| **Chain of Responsibility** | Behavioral | `userAuth.ts` + all routes | Auth → File → Handler sequential chain |
| **Strategy** | Behavioral | `userAuth.ts`, `axiosInstance.js` | Cross-browser token handling runtime pe |
| **Observer** | Behavioral | `appStore.subscribe()` | Cart changes pe auto DB sync |
| **Proxy** | Structural | `axiosInstance.js` | Har request pe JWT auto-inject transparently |
| **Memento/Snapshot** | Behavioral | `Order.ts`, `order.controller.ts` | Order history hamesha accurate — menu change ho phir bhi |
| **Module** | Structural | `authApi.js` | Auth API calls grouped, implementation hidden |
| **Singleton** | Creational | `axiosInstance`, `appStore`, DB connection | Ek instance — memory efficient, consistent state |

---

*Eats Project — Design Patterns Documentation*  
*April 2026*
