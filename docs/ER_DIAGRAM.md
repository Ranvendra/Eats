# Entity-Relationship (ER) Diagram - Eats System

The ER Diagram defines the data structure and relationships between core entities in the MongoDB database.

## Database Schema (Mermaid)

```mermaid
erDiagram
    USER ||--|| CART : "owns"
    USER ||--o{ ORDER : "places"
    RESTAURANT ||--o{ MENU_ITEM : "contains"
    RESTAURANT ||--o{ ORDER : "fulfills"
    ORDER ||--|{ ORDER_ITEM : "consists of"
    CART ||--o{ CART_ITEM : "stores"

    USER {
        ObjectId _id PK
        string userName
        string userEmail "Unique"
        string password "Hashed"
        string userPhone "Unique"
        string userAddress
        string profilePicture "Cloudinary URL"
        datetime createdAt
    }

    RESTAURANT {
        ObjectId _id PK
        string restaurantName
        string restaurantCity "Indexed"
        string[] restaurantCuisine
        number restaurantRating
        number restaurantDeliveryTime
        string restaurantImage
        boolean isRestaurantOpen
    }

    MENU_ITEM {
        ObjectId _id PK
        ObjectId restaurantId FK
        string menuItemName
        number menuItemPrice
        string menuItemCategory "Indexed"
        boolean isMenuItemVeg
        string menuItemImage
    }

    CART {
        ObjectId userId FK "Unique"
        ObjectId restaurantId FK
        string restaurantName
        number totalQuantity
        number totalAmount
        array items "CartItem sub-docs"
    }

    ORDER {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId restaurantId FK
        string restaurantName "Snapshotted"
        number orderTotalAmount
        number deliveryFee
        string paymentStatus "PENDING | PAID | FAILED"
        string orderStatus "PREPARING | DELIVERED | CANCELLED"
        datetime createdAt
    }
```

## Field Level Analysis (Industry Standard)

### 1. Snapshotting Pattern (Order Entity)
To ensure historical accuracy, the `Order` entity does **not** simply reference `MENU_ITEM`. It contains an `orderItems` array with:
- `itemName`: String (copied from MenuItem)
- `itemPrice`: Number (copied from MenuItem)
- `itemQuantity`: Number

### 2. Indexing Strategy
- **User**: Unique index on `userEmail` and `userPhone` for O(1) login lookups.
- **Restaurant**: Compound index on `restaurantCity + restaurantCuisine` to optimize discovery queries.
- **Order**: Descending index on `userId + createdAt` for fast order history rendering.

### 3. Cart Persistence
Unlike standard e-commerce, the `Cart` is a first-class entity in the DB, linked to the `User` via `userId`. This enables **Cross-Device Persistence**.
