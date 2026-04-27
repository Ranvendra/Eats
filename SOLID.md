# 🏛️ SOLID Principles — Eats Backend Documentation
### (Simple Hinglish mein)

> SOLID 5 design principles hain jo code ko **maintainable, readable aur scalable** banate hain.  
> Yahan dekho ki Eats backend mein ye **kahan aur kaise** use kiye gaye hain — real files aur code ke saath.

---

## 📍 Quick Map — Ek Nazar Mein

```
server.ts                  → OCP  (routes inject karo, App.ts mat chhedo)
app.ts                     → OCP + DIP  (Routes interface use karta hai)
routes/auth.routes.ts      → LSP + ISP  (implements Routes)
routes/cart.routes.ts      → LSP + ISP  (implements Routes)
routes/order.routes.ts     → LSP + ISP  (implements Routes)
routes/payment.routes.ts   → LSP + ISP  (implements Routes)
routes/restaurant.routes.ts → LSP + ISP  (implements Routes)
controllers/auth.controller.ts  → SRP  (sirf HTTP handle)
controllers/cart.controller.ts  → SRP  (sirf HTTP handle)
controllers/order.controller.ts → SRP  (sirf HTTP handle)
services/auth.service.ts        → SRP  (sirf business logic)
utils/validation.ts             → SRP  (sirf validate karna)
utils/route.interface.ts        → ISP + DIP  (minimal interface — sirf 2 fields)
config/cloudinary.ts            → SRP  (sirf upload handle)
config/multer.ts                → SRP  (sirf file config)
models/User.ts                  → ISP  (sirf User ka interface)
models/Cart.ts                  → ISP  (sirf Cart ka interface)
models/Order.ts                 → ISP  (sirf Order ka interface)
models/Restaurant.ts            → ISP  (sirf Restaurant ka interface)
models/MenuItem.ts              → ISP  (sirf MenuItem ka interface)
```

---

## 1️⃣ S — Single Responsibility Principle (SRP)

> ### "Ek class ya file ka sirf **ek hi kaam** hona chahiye."
> Agar tumhare class ke badalne ki **ek se zyada wajah** ho, toh SRP toot raha hai.

---

### ✅ Example 1 — `AuthController` vs `AuthService`

Pehle samjho ki **controller** aur **service** alag kyun hain:

**`controllers/auth.controller.ts`** — Sirf HTTP kaam karta hai:
```typescript
class AuthController {
  private authService = new AuthService();

  public handleSignup = async (req: Request, res: Response) => {
    validateSignUpData(req);                           // validation call
    const user = await this.authService.signupUser(...)  // service ko kaam do
    res.status(201).json({ message: "User added!", data: userResponse });
    // ↑ Controller ka kaam: req lena, service ko dena, res bhejna — bas itna
  };
}
```

**`services/auth.service.ts`** — Sirf business logic:
```typescript
class AuthService {
  public async signupUser(userData: any) {
    const user = new User({ userName, userEmail, password, userPhone });
    const savedUser = await user.save();
    return savedUser;
    // ↑ Service ka kaam: DB se baat karna, logic chalana — HTTP ka kuch pata nahi
  }

  public async loginUser(identifier: string, passwordInput: string) {
    const user = await User.findOne({ $or: [{ userEmail: identifier }, { userPhone: identifier }] });
    const isPasswordValid = await user.validatePassword(passwordInput);
    const token = await user.getJWT();
    return { user, token };
  }
}
```

**Kyun alag kiya?**
- `AuthController` change hoga jab API ka structure badle (routes, HTTP codes)
- `AuthService` change hoga jab business logic badle (login rules, token expiry)
- Dono ke badalne ki alag-alag wajah hain → **SRP**

---

### ✅ Example 2 — `validation.ts` — Sirf Validate Karna

```typescript
// utils/validation.ts
export const validateSignUpData = (req: Request) => {
  const { userName, userEmail, password, userPhone } = req.body;

  if (!userName || !userEmail || !password || !userPhone)
    throw new Error("All fields are required");

  if (!validator.isEmail(userEmail))
    throw new Error("Email ID is not valid");

  if (!validator.isStrongPassword(password))
    throw new Error("Password must be strong");
};

export const validateLoginData = (req: Request) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) throw new Error("All fields are required");
  // ...
};
```

Ye logic `AuthController` ke andar bhi likh sakte the — lekin alag file mein rakha.  
**Wajah:** Validation ke badalne ki wajah alag hogi (rules change) vs controller ke badalne ki wajah alag (HTTP structure change).

---

### ✅ Example 3 — `config/cloudinary.ts` aur `config/multer.ts`

```typescript
// config/multer.ts — Sirf file upload configure karna
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});
export default upload;
```

```typescript
// config/cloudinary.ts — Sirf Cloudinary pe upload karna
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result!.secure_url);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
```

Dono alag files — alag responsibilities.  
Kal agar Cloudinary se S3 pe shift karna ho, sirf `cloudinary.ts` change hogi — Multer untouched.

---

### ✅ Example 4 — `middlewares/userAuth.ts` — Sirf Auth Check

```typescript
// Sirf JWT verify karo aur req.user set karo — koi aur kaam nahi
export const userAuth: RequestHandler = async (req, res, next) => {
  const token = /* header ya cookie se nikalo */;
  const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedMessage._id);
  req.user = user;
  next();
};
```

---

### 🔴 SRP Violation Kaisi Lagti? (Anti-pattern)

```typescript
// BAD — Ek hi controller mein sab kuch
class AuthController {
  public handleSignup = async (req, res) => {
    // 1. Validate — controllers ka kaam nahi
    if (!req.body.email) return res.status(400).json({ message: "Email required" });

    // 2. Hash password — service ka kaam hai
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Save to DB — model/service ka kaam
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    // 4. Generate token — service ka kaam
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 5. Send email — totally alag concern
    await sendWelcomeEmail(user.userEmail);

    res.status(201).json({ user, token });
  };
}
// Yahan controller ke badalne ki 5 alag wajahein hain — SRP toot gaya
```

---

## 2️⃣ O — Open/Closed Principle (OCP)

> ### "Class **extension ke liye open** honi chahiye, **modification ke liye closed**."
> Naya feature add karo — purana working code mat chhedo.

---

### ✅ `utils/route.interface.ts` + `app.ts` + `server.ts`

**Step 1 — Interface define kiya:**
```typescript
// utils/route.interface.ts
export interface Routes {
  path?: string;
  router: Router;
}
```

**Step 2 — App class ek baar likhi, kabhi nahi badle:**
```typescript
// app.ts — YE CLASS KABHI NAHI BADLI
class App {
  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);  // ← bas Routes array loop karo
    this.connectDatabase();
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);  // ← generic — koi bhi Routes aao
    });
  }
}
```

**Step 3 — Naya feature/route add karna = sirf server.ts mein ek line:**
```typescript
// server.ts — Naya route add kiya, App.ts ko haath bhi nahi lagaye
const app = new App([
  new AuthRoutes(),
  new CartRoutes(),
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes(),
  // new NotificationRoutes(),  ← kal add karna ho toh sirf yahan
  // new AdminRoutes(),         ← bas ek line — App.ts untouched
]);

app.startServer();
```

**Summary:**
- `App` class → **Closed for modification** (kabhi nahi badli)
- `Routes` interface → **Open for extension** (koi bhi class implement karo aur pass karo)

---

### 🔴 OCP Violation Kaisi Lagti?

```typescript
// BAD — Har naye route pe App.ts mein if/else add karna padta
class App {
  constructor(routeType: string) {
    if (routeType === "auth") {
      const authRoutes = new AuthRoutes();
      this.app.use("/", authRoutes.router);
    } else if (routeType === "cart") {
      const cartRoutes = new CartRoutes();
      this.app.use("/", cartRoutes.router);
    }
    // Naya route aaya? App.ts edit karo — OCP violation
  }
}
```

---

## 3️⃣ L — Liskov Substitution Principle (LSP)

> ### "Parent type ki jagah child type rakh do — program sahi chalna chahiye."
> `Routes` interface ki jagah `AuthRoutes` rakho ya `CartRoutes` — App same kaam kare.

---

### ✅ Sab Route Classes `Routes` implement karti hain

```typescript
// routes/auth.routes.ts
class AuthRoutes implements Routes {
  public path = "/api/v1/auth";
  public router = Router();

  constructor() { this.initializeRoutes(); }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.handleSignup as any);
    this.router.post(`${this.path}/login`, this.authController.handleLogin as any);
    // ...
  }
}

// routes/cart.routes.ts
class CartRoutes implements Routes {
  public path = "/api/v1/cart";
  public router = Router();

  constructor() { this.initializeRoutes(); }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, userAuth, this.cartController.getCart as any);
    // ...
  }
}

// routes/order.routes.ts
class OrderRoutes implements Routes {
  public path = "/api/v1/orders";
  public router = Router();
  // ...
}

// routes/payment.routes.ts
class PaymentRoutes implements Routes {
  public path = "/api/v1/payment";
  public router = Router();
  // ...
}

// routes/restaurant.routes.ts
class RestaurantRoutes implements Routes {
  public path = "/api/v1/restaurants";
  public router = Router();
  // ...
}
```

**App.ts mein yahi hota hai:**
```typescript
private initializeRoutes(routes: Routes[]) {
  routes.forEach((route) => {
    this.app.use("/", route.router);
    // ↑ Chahe AuthRoutes ho ya CartRoutes — dono ka .router same kaam karta hai
    // LSP: parent (Routes) ki jagah koi bhi child use karo — program nahi tootega
  });
}
```

**LSP Proof:**
- `Routes` interface expect karta hai: `router` property.
- `AuthRoutes` deta hai: ✅ `router`
- `CartRoutes` deta hai: ✅ `router`
- `OrderRoutes` deta hai: ✅ `router`
- Koi bhi substitution karo — App same kaam karega.

---

### 🔴 LSP Violation Kaisi Lagti?

```typescript
// BAD — Ek route class ne interface ka contract toda
class BrokenRoutes implements Routes {
  public router = null; // ← null diya instead of Router instance
  // Ab App.ts mein this.app.use("/", route.router) crash karega
}
```

---

## 4️⃣ I — Interface Segregation Principle (ISP)

> ### "Classes ko **sirf woh methods implement karni chahiye jo unhe chahiye**."
> Ek bada "God Interface" mat banao — chhote focused interfaces banao.

---

### ✅ `Routes` Interface — Minimal aur Focused

```typescript
// utils/route.interface.ts — Sirf 2 fields, bas!
export interface Routes {
  path?: string;
  router: Router;
}
```

Agar hum ek bada interface banate:
```typescript
// BAD — ISP violation
export interface Routes {
  path?: string;
  router: Router;
  connectDatabase(): void;   // ← Route class ka kaam nahi
  startServer(): void;        // ← Route class ka kaam nahi
  initializeMiddlewares(): void; // ← Route class ka kaam nahi
}
// Ab har AuthRoutes, CartRoutes ko ye sab implement karne padte — bekar
```

---

### ✅ Model Interfaces — Har Model Ka Apna Interface

```typescript
// models/User.ts — Sirf User ki cheezein
export interface IUser extends Document {
  userName: string;
  userEmail: string;
  password?: string;
  userPhone: string;
  profilePicture: string;
  validatePassword(passwordInput: string): Promise<boolean>;
  getJWT(): string;
}

// models/Cart.ts — Sirf Cart ki cheezein
export interface ICartItem {
  menuItemId: mongoose.Types.ObjectId;
  menuItemName: string;
  menuItemPrice: number;
  itemQuantity: number;
}
export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalQuantity: number;
  totalAmount: number;
}

// models/Order.ts — Sirf Order ki cheezein
export type OrderStatus = "CREATED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  isVeg: boolean;
}
export interface IOrder extends Document {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  orderItems: IOrderItem[];
}
```

**Kyun alag-alag interfaces?**
- `IUser` mein `validatePassword()` aur `getJWT()` hain — ye Cart ya Order ke kaam ke nahi.
- `ICart` mein `isHydrated`, `items[]` hain — ye User ke kaam ke nahi.
- Agar ek bada interface hota, Cart model ko `validatePassword()` implement karni padti — bilkul bekar.

---

### ✅ TypeScript Union Types — Focused Constraints

```typescript
// Sirf valid values allow karo — koi bhi string nahi
export type OrderStatus = "CREATED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
```

Ye ISP ka hi extension hai — sirf relevant values jo is domain ke liye hain, sab kuch nahi.

---

### 🔴 ISP Violation Kaisi Lagti?

```typescript
// BAD — Ek bada "God Interface"
export interface EverythingInterface {
  router: Router;
  connectDB(): void;
  validatePassword(): Promise<boolean>;
  getJWT(): string;
  uploadImage(): Promise<string>;
  sendEmail(): Promise<void>;
  // Ab har class jo ye implement kare use sab likhni padengi — ISP viola
}
```

---

## 5️⃣ D — Dependency Inversion Principle (DIP)

> ### "**High-level modules** ko **low-level modules** pe directly depend nahi karna chahiye."
> ### "**Dono ko abstraction (interface) pe depend karna chahiye.**"

---

### ✅ Example 1 — `App` class + `Routes` Interface

```
Bina DIP ke (BAD):
App.ts → AuthRoutes directly
App.ts → CartRoutes directly
App.ts → OrderRoutes directly
(App directly concrete classes pe depend hai)

DIP ke saath (GOOD):
App.ts → Routes interface
AuthRoutes → Routes interface implement karta hai
CartRoutes → Routes interface implement karta hai
(Dono abstraction pe depend hain)
```

```typescript
// app.ts — HIGH LEVEL MODULE
// Ye Routes INTERFACE pe depend karta hai — AuthRoutes ya CartRoutes directly nahi jaanta
class App {
  constructor(routes: Routes[]) {  // ← Interface
    this.initializeRoutes(routes);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);  // ← Bas .router use karo — koi bhi dedo
    });
  }
}
```

```typescript
// server.ts — COMPOSITION ROOT (yahan concrete classes inject hoti hain)
const app = new App([
  new AuthRoutes(),      // ← Concrete implementation inject ho rahi hai
  new CartRoutes(),      // ← Ye Dependency Injection hai
  new OrderRoutes(),
  new PaymentRoutes(),
  new RestaurantRoutes(),
]);
```

**App class ko kabhi pata nahi hoga ki `AuthRoutes` exist karta hai —  
woh sirf `Routes` interface jaanti hai.**

---

### ✅ Example 2 — `AuthController` → `AuthService`

```typescript
// auth.controller.ts — HIGH LEVEL MODULE
class AuthController {
  private authService = new AuthService();
  // ↑ AuthService inject ki gayi hai (Constructor Injection pattern)
  // Controller ko AuthService ke andar kya ho raha hai bilkul pata nahi
  // Kal AuthService ki implementation change ho — Controller same rahega

  public handleLogin = async (req, res) => {
    const { user, token } = await this.authService.loginUser(identifier, password);
    // ↑ Sirf public method call — andar ki details hidden (Encapsulation + DIP)
    res.json({ message: "Login Successful!", data: userResponse, token });
  };
}
```

```typescript
// auth.service.ts — LOW LEVEL MODULE
// AuthController jaisi class specific details yahan hain
class AuthService {
  public async loginUser(identifier: string, passwordInput: string) {
    const user = await User.findOne({ ... });
    const isPasswordValid = await user.validatePassword(passwordInput);
    const token = await user.getJWT();
    return { user, token };
  }
}
```

**DIP flow:**
```
AuthController (high-level)
    ↓ depends on
AuthService (abstraction — public methods)
    ↓ implements
Actual DB queries + bcrypt + JWT logic (low-level)
```

---

### 🔴 DIP Violation Kaisi Lagti?

```typescript
// BAD — Controller directly DB se baat kar raha hai
class AuthController {
  public handleLogin = async (req, res) => {
    // Low-level detail directly controller mein
    const user = await User.findOne({ userEmail: req.body.identifier });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
    // Controller ab low-level implementation pe directly depend hai — DIP violation
  };
}
```

---

## ✅ SOLID — Final Summary Table

| Principle | Full Name | Kahaan Use Hua | Ek Line Mein |
|---|---|---|---|
| **S** | Single Responsibility | `AuthController`, `AuthService`, `validation.ts`, `cloudinary.ts`, `multer.ts`, `userAuth.ts` | Har file/class ka ek kaam |
| **O** | Open/Closed | `app.ts` + `route.interface.ts` + `server.ts` | Naya route = sirf server.ts mein ek line |
| **L** | Liskov Substitution | `AuthRoutes`, `CartRoutes`, `OrderRoutes`, `PaymentRoutes`, `RestaurantRoutes` | Koi bhi route class safely swap ho sakti hai |
| **I** | Interface Segregation | `Routes` interface, `IUser`, `ICart`, `IOrder`, `IMenuItem`, `IRestaurant` | Chhote focused interfaces — koi God Interface nahi |
| **D** | Dependency Inversion | `App` ← `Routes[]`, `AuthController` ← `AuthService` | High-level modules interface pe depend karte hain |

---

*Eats Backend — SOLID Documentation*  
*April 2026*
