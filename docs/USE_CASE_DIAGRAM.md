# Use Case Diagram - Eats Food Delivery System

The Use Case Diagram illustrates the functional requirements of the system from the perspective of different actors.

## Actors
1. **Customer (Primary)**: The end-user who browses, orders, and manages their profile.
2. **System (Automated)**: Background processes for data syncing and payment verification.
3. **Payment Gateway (External)**: Razorpay API for handling financial transactions.
4. **Image Storage (External)**: Cloudinary for hosting media assets.

## Use Case Diagram (Mermaid)

```mermaid
useCaseDiagram
    actor "Customer" as C
    actor "System" as S
    actor "Razorpay" as P
    actor "Cloudinary" as I

    package "Identity Management" {
        usecase "Sign Up / Register" as UC1
        usecase "Login (JWT Auth)" as UC2
        usecase "Update Profile & Photo" as UC3
        usecase "Logout" as UC4
    }

    package "Discovery & Selection" {
        usecase "Browse Restaurants" as UC5
        usecase "Search / Filter by Cuisine" as UC6
        usecase "View Restaurant Menu" as UC7
    }

    package "Order & Cart" {
        usecase "Manage Persistent Cart" as UC8
        usecase "Place Order" as UC9
        usecase "Process Payment" as UC10
        usecase "View Order History" as UC11
    }

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> UC6
    C --> UC7
    C --> UC8
    C --> UC9
    C --> UC11

    UC3 ..> I : <<include>> "Upload Image"
    UC9 ..> UC10 : <<include>>
    UC10 ..> P : "Verify Transaction"
    UC8 ..> S : "Sync with Database"
```

## Detailed Use Case Descriptions

### UC8: Manage Persistent Cart
- **Goal**: Allow users to maintain a cart across devices.
- **Flow**: User adds item -> Redux state updates -> `cartRouter.post("/sync")` sends state to MongoDB.
- **Rule**: If a user adds an item from a different restaurant, the system logic (implemented in frontend) handles the conflict.

### UC9: Place Order
- **Goal**: Convert cart items into a permanent transactional record.
- **Flow**: Frontend calls `paymentRouter` -> Razorpay Order Created -> User Pays -> Frontend calls `orderRouter` with `razorpay_signature`.
- **Constraint**: Backend must snapshot item prices to prevent "Price Drift" in historical records.
