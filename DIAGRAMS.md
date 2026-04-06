# Eats Project System Architecture

This document provides a formalized, high-fidelity view of the system's architecture and data models. It uses **Unicode Box-Drawing** and **Industry Tables** to ensure the diagrams are visible and professional in any text viewer.

---

## 1. CLASS DIAGRAM (UML Standard)
This diagram represents the structural design of the backend objects, their attributes, and their behaviors.

```text
╔═════════════════════════════╗          ╔═════════════════════════════╗
║            USER             ║          ║            CART             ║
╠═════════════════════════════╣          ╠═════════════════════════════╣
║ - userName: String          ║ 1      1 ║ - userId: ObjectId (FK)     ║
║ - userEmail: String (Unique)║──────────║ - restaurantId: ObjectId    ║
║ - userPhone: String (Unique)║          ║ - items: Array<CartItem>    ║
║ - userAddress: String       ║ (Owns)   ║ - totalAmount: Number       ║
╠═════════════════════════════╣          ╠═════════════════════════════╣
║ + validatePassword(pass)    ║          ║ + syncWithDB()              ║
║ + getJWT(): String          ║          ║ + calculateTotal()          ║
╚═════════════════════════════╝          ╚═════════════════════════════╝
          │
          │ 1 (Places)
          │
          ▼ *
╔═════════════════════════════╗          ╔═════════════════════════════╗
║            ORDER            ║          ║         RESTAURANT          ║
╠═════════════════════════════╣          ╠═════════════════════════════╣
║ - userId: ObjectId (FK)     ║ *      1 ║ - restaurantName: String    ║
║ - restaurantId: ObjectId    ║──────────║ - restaurantCity: String    ║
║ - orderItems: Array         ║ (To)     ║ - restaurantRating: Number  ║
║ - orderStatus: Enum         ║          ║ - isRestaurantOpen: Boolean ║
╠═════════════════════════════╣          ╠═════════════════════════════╣
║ + updateStatus(status)      ║          ║ + updateAvailability()      ║
╚═════════════════════════════╝          ╚═════════════════════════════╝
```

---

## 2. ENTITY RELATIONSHIP DIAGRAM (ERD - Database Schema)
The database mapping follows industry standard Crow's Foot relationship logic.

### Relationship Matrix
```text
  [ USER ] 1 ────────── 1 [ CART ]
      │ (owns)
      │
      │ 1 (places)
      │
      ▼ *
  [ ORDER ] * ───────── 1 [ RESTAURANT ]
      │ (to)                  │
      │                       │ 1 (offers)
      │                       │
      ▼ *                     ▼ *
  [ ORDER_ITEM ] ───▶ [ MENU_ITEM ]
```

### Industry Data Dictionary (Schema Tables)
| Collection | Field | Type | Constraint | Relation |
| :--- | :--- | :--- | :--- | :--- |
| **Users** | `_id` | ObjectId | **PK** | - |
| | `userEmail` | String | Unique, Indexed | - |
| **Restaurants**| `_id` | ObjectId | **PK** | - |
| | `restaurantName`| String | Required | - |
| **Menu_Items** | `_id` | ObjectId | **PK** | - |
| | `restaurantId` | ObjectId | **FK** | -> Restaurants._id |
| **Orders** | `_id` | ObjectId | **PK** | - |
| | `userId` | ObjectId | **FK** | -> Users._id |
| | `restaurantId` | ObjectId | **FK** | -> Restaurants._id |

---

## 3. USE CASE DIAGRAM (System Operations)
The Functional Matrix represents the "Use Case Specification" used in professional technical requirements documents.

| Actor | Action (Use Case) | Description | Success Condition |
| :--- | :--- | :--- | :--- |
| **Customer** | **Search & Browse** | Look for restaurants by city or cuisine | List of available restaurants returned |
| **Customer** | **Cart Management** | Add/Remove/Update items in cart | Cart persists across browser sessions |
| **Customer** | **Payment/Checkout**| Pay via Razorpay & place order | Payment verified; Order status = PREPARING |
| **Customer** | **View Orders** | Access historical order records | Complete order history retrieved |
| **System** | **Auth Sync** | Validate JWT & session state | User profile accessible (Protected) |

---

## 4. SYSTEM FLOW (Technical Sequence)
```text
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ CUSTOMER │      │ FRONTEND │      │ BACKEND  │      │ DATABASE │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │ Search Req      │                 │                 │
     │────────────────▶│   GET /res      │                 │
     │                 │────────────────▶│                 │
     │                 │                 │    Find Query   │
     │                 │                 │────────────────▶│
     │                 │                 │                 │
     │                 │   JSON Data     │    Doc Results  │
     │                 │◀────────────────│◀────────────────│
     │  Render UI      │                 │                 │
     │◀────────────────│                 │                 │
```

> **Note:** For a graphical, zoomable view, you can paste the Mermaid code provided in previous turns into [Mermaid Live Editor](https://mermaid.live/).
