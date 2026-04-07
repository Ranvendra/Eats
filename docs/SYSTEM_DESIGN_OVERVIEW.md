# System Design Overview - Eats Food Delivery

## 1. Project Vision
**Eats** is a robust, full-stack food delivery application designed for scalability and user persistence. It solves the common problem of "volatile carts" by synchronizing local state with a cloud database.

## 2. Technology Stack
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | High performance and modern hook-based architecture. |
| **State** | Redux Toolkit | Centralized, predictable state management for complex cart/auth flows. |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid, responsive UI development. |
| **Backend** | Node.js + Express | Event-driven architecture suitable for I/O intensive API requests. |
| **Database** | MongoDB + Mongoose | Schema flexibility for varying menu structures and fast document reads. |
| **Auth** | JWT + HttpOnly Cookies | Industry standard for secure, stateless session management. |
| **Media** | Cloudinary | CDN-backed image hosting for optimized asset delivery. |
| **Payments** | Razorpay | Secure Indian payment gateway integration. |

## 3. High-Level Architecture (HLD)

### Data Persistence Flow
1. **User Action**: User adds a "Paneer Tikka" to the cart.
2. **Local State**: Redux `cartSlice` updates immediately (Optimistic UI).
3. **Synchronization**: A side-effect (via `App.jsx` or component logic) triggers `POST /api/v1/cart/sync`.
4. **Database**: MongoDB updates the `Cart` document for that `userId`.
5. **Recovery**: User refreshes the page or switches from Mobile to Desktop. `App.jsx` fetches `GET /api/v1/cart` and hydrates Redux.

## 4. Security Protocols
- **Credential Protection**: No plain-text passwords. All are hashed via `bcrypt` before database entry.
- **JWT Security**: Tokens are **never** stored in `localStorage` (vulnerable to XSS). Instead, they are stored in `HttpOnly` cookies.
- **CORS Policy**: Configured to only allow requests from the authorized frontend domain.
- **Input Validation**: Backend uses `validator.js` and custom regex to sanitize email, phone, and profile data.

## 5. Scalability Considerations
- **Indexing**: Database indexes on `city`, `cuisine`, and `userId` ensure sub-100ms response times even with 10k+ records.
- **Stateless API**: The backend doesn't store session state, allowing it to be horizontally scaled across multiple server instances (e.g., via PM2 or Kubernetes).
