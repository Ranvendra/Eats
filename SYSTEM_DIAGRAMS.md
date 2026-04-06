# Eats System Diagrams

This document summarizes the Eats platform with three views of the system:
- Use Case Diagram: User-facing behavior and interactions.
- Class Diagram: Core backend domain structure and logic.
- ER Diagram: The persisted data model and relationships.

---

## 1. Use Case Diagram

This diagram shows the major interactions between the Customer and the Eats platform, with Razorpay shown only as backend-supported payment capability.

```mermaid
flowchart LR
    user([Customer / User])
    razorpay([Razorpay])

    signup((Sign Up))
    login((Log In))
    browse((Browse Restaurants))
    viewMenu((View Restaurant Menu))
    manageCart((Manage Cart))
    placeOrder((Place Order))
    payment((Razorpay Payment Capability))
    orders((View Order History))
    profile((Update Profile))
    logout((Log Out))

    user --- signup
    user --- login
    user --- browse
    user --- viewMenu
    user --- manageCart
    user --- placeOrder
    user --- orders
    user --- profile
    user --- logout

    razorpay --- payment
```

---

## 2. Class Diagram

This diagram represents the core entities in the system, their attributes, and their behaviors.

```mermaid
classDiagram
    class User {
        +String userName
        +String userEmail
        +String password
        +String userPhone
        +String userAddress
        +String profilePicture
        +validatePassword(passwordInput)
        +getJWT()
    }

    class Restaurant {
        +String restaurantName
        +String restaurantAddress
        +String restaurantCity
        +String[] restaurantCuisine
        +Number restaurantRating
        +Number restaurantDeliveryTime
        +Boolean isRestaurantOpen
        +String restaurantImage
    }

    class MenuItem {
        +ObjectId restaurantId
        +String menuItemName
        +Number menuItemPrice
        +String menuItemCategory
        +Boolean isMenuItemVeg
        +Boolean isMenuItemAvailable
    }

    class Cart {
        +ObjectId userId
        +ObjectId restaurantId
        +CartItem[] items
        +Number totalQuantity
        +Number totalAmount
    }

    class Order {
        +ObjectId userId
        +ObjectId restaurantId
        +OrderItem[] orderItems
        +Number orderTotalAmount
        +Number deliveryFee
        +String deliveryAddress
        +String paymentStatus
        +String orderStatus
    }

    User "1" -- "1" Cart : has
    User "1" -- "0..*" Order : places
    Restaurant "1" -- "0..*" MenuItem : offers
    Restaurant "1" -- "0..*" Order : receives
    Cart "1" -- "0..*" MenuItem : contains
    Order "1" -- "0..*" MenuItem : contains
```

---

## 3. Entity Relationship (ER) Diagram

This diagram illustrates the database schema and how different entities relate to each other in MongoDB.

```mermaid
erDiagram
    USER ||--|| CART : "owns"
    USER ||--o{ ORDER : "places"
    RESTAURANT ||--o{ MENU_ITEM : "offers"
    RESTAURANT ||--o{ ORDER : "receives"
    CART ||--o{ MENU_ITEM : "contains"
    ORDER ||--o{ MENU_ITEM : "contains"

    USER {
        string userName
        string userEmail UK
        string password
        string userPhone UK
        string userAddress
        string profilePicture
    }

    RESTAURANT {
        string restaurantName
        string restaurantAddress
        string restaurantCity
        string[] restaurantCuisine
        number restaurantRating
        boolean isRestaurantOpen
        string restaurantImage
    }

    MENU_ITEM {
        objectId restaurantId FK
        string menuItemName
        number menuItemPrice
        string menuItemCategory
        boolean isMenuItemVeg
        boolean isMenuItemAvailable
    }

    CART {
        objectId userId FK
        objectId restaurantId FK
        object[] items
        number totalQuantity
        number totalAmount
    }

    ORDER {
        objectId userId FK
        objectId restaurantId FK
        object[] orderItems
        number orderTotalAmount
        number deliveryFee
        string deliveryAddress
        string paymentStatus
        string orderStatus
    }
```
