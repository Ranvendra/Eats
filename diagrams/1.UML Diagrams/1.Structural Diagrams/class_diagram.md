# System Design & Object-Oriented Architecture: Eats App

This document outlines the detailed **Object-Oriented Programming (OOP) Class Diagram** and analysis for the **Eats Application**, modeling the current schema capabilities with a scalable design suitable for transitioning to **TypeScript** under best-practice System Design guidelines.

## 1. Structural Analysis of the System

The project is structured into **two main components** :

* **Client (Frontend)**: A React/Vite-based application divided into domain-specific, modular folders (`AuthPage`, `Cart`, `HomePage`, `Orders`, `Profile`, `Restaurants`).
* **Server (Backend)**: An Express/Node.js REST API using Mongoose for MongoDB. It follows an **MVC-like pattern** (`controllers`, `models`, `routes`, `middlewares`, `services`).

### Comprehensive Model Fields Analysis:

Before designing the diagram, we carefully evaluated the database schema structure from the Mongoose models:

1. **User Model**: Core authentication and profile model.
   * *Fields*: `userName`, `userEmail`, `password` (hashed), `userPhone`, `userAddress`, `userCity`, `nickName`, `gender`, `country`, `language`, `timeZone`, `profilePicture`.
   * *Methods*: `validatePassword()`, `getJWT()`.
2. **Restaurant Model**: Represents the restaurant vendor.
   * *Fields*: `restaurantName`, `restaurantAddress`, `restaurantCity`, `restaurantPincode`, `restaurantPhone`, `restaurantCuisine` (Array), `restaurantRating`, `restaurantTotalRatings`, `restaurantDeliveryTime`, `restaurantMinOrder`, `isRestaurantOpen`, `restaurantImage`, `restaurantDescription`, `isRestaurantPromoted`, `offer`, `restaurantTags`.
3. **MenuItem Model**: Represents individual items offered by a restaurant.
   * *Fields*: `restaurantId` (Ref), `menuItemName`, `menuItemPrice`, `menuItemCategory`, `isMenuItemVeg`, `isMenuItemAvailable`, `menuItemImage`, `menuItemDescription`, `menuItemRating`, `menuItemCalories`, `menuItemServes`.
4. **Cart & CartItem Models**: Handles user intent to order.
   * *Cart*: `userId` (Ref), `restaurantId` (Ref), `restaurantName`, `totalQuantity`, `totalAmount`.
   * *CartItem* (Subdocument): `menuItemId` (Ref), `menuItemName`, `menuItemPrice`, `itemQuantity`, `menuItemImage`, `isMenuItemVeg`.
5. **Order & OrderItem Models**: The final transactional boundary.
   * *Order*: `userId` (Ref), `restaurantId` (Ref), `restaurantName`, `orderTotalAmount`, `deliveryFee`, `deliveryAddress`, `paymentStatus` (Enum), `orderStatus` (Enum).
   * *OrderItem* (Subdocument): `menuItemId` (Ref), `itemName`, `itemPrice`, `itemQuantity`, `isVeg`.

---

## 2. Comprehensive OOP Class Diagram

Below is the **Mermaid Class Diagram** designed specifically to help your project lead understand the application’s deep **architectural topology**. It emphasizes strong typing, single responsibility, and rigorous relationship flows modeled for a TypeScript conversion.

```mermaid
classDiagram
    direction TB

    %% -------------------------------------------------------------
    %% 1. INHERITANCE: Abstract Base Entity
    %% -------------------------------------------------------------
    class BaseEntity {
        <<abstract>>
        +String _id
        +Date createdAt
        +Date updatedAt
    }

    %% -------------------------------------------------------------
    %% 2. CORE DOMAIN MODELS (Data Layer)
    %% -------------------------------------------------------------
    class User {
        +String userName
        +String userEmail
        -String password
        +String userPhone
        +String userAddress
        +String userCity
        +String nickName
        +String gender
        +String country
        +String language
        +String timeZone
        +String profilePicture
        +validatePassword(passwordInput: String) Boolean
        +getJWT() String
    }
  
    class Restaurant {
        +String restaurantName
        +String restaurantAddress
        +String restaurantCity
        +String restaurantPincode
        +String restaurantPhone
        +String[] restaurantCuisine
        +Number restaurantRating
        +Number restaurantTotalRatings
        +Number restaurantDeliveryTime
        +Number restaurantMinOrder
        +Boolean isRestaurantOpen
        +String restaurantImage
        +String restaurantDescription
        +Boolean isRestaurantPromoted
        +String offer
        +String[] restaurantTags
    }
  
    class MenuItem {
        +String restaurantId
        +String menuItemName
        +Number menuItemPrice
        +String menuItemCategory
        +Boolean isMenuItemVeg
        +Boolean isMenuItemAvailable
        +String menuItemImage
        +String menuItemDescription
        +Number menuItemRating
        +Number menuItemCalories
        +String menuItemServes
    }
  
    class Cart {
        +String userId
        +String restaurantId
        +String restaurantName
        +CartItem[] items
        +Number totalQuantity
        +Number totalAmount
        +calculateTotal() Number
        +addItem(item: CartItem) void
        +clearCart() void
    }
  
    class CartItem {
        +String menuItemId
        +String menuItemName
        +Number menuItemPrice
        +Number itemQuantity
        +String menuItemImage
        +Boolean isMenuItemVeg
    }
  
    class Order {
        +String userId
        +String restaurantId
        +String restaurantName
        +OrderItem[] orderItems
        +Number orderTotalAmount
        +Number deliveryFee
        +String deliveryAddress
        +OrderStatus orderStatus
        +PaymentStatus paymentStatus
        +processPayment() Boolean
        +updateStatus(status: OrderStatus) void
    }

    class OrderItem {
        +String menuItemId
        +String itemName
        +Number itemPrice
        +Number itemQuantity
        +Boolean isVeg
    }

    class OrderStatus {
        <<enumeration>>
        CREATED
        ACCEPTED
        PREPARING
        OUT_FOR_DELIVERY
        DELIVERED
        CANCELLED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        PAID
        FAILED
        REFUNDED
    }

    %% -------------------------------------------------------------
    %% 3. ARCHITECTURAL PATTERNS (Repositories, Services, Controllers)
    %% -------------------------------------------------------------
    class IRepository~T~ {
        <<interface>>
        +findById(id: String) T
        +save(entity: T) T
        +delete(id: String) Boolean
    }

    class OrderRepository {
        +findById(id: String) Order
        +findByUserId(userId: String) Order[]
        +save(order: Order) Order
    }
  
    class OrderService {
        -OrderRepository orderRepository
        -PaymentService paymentService
        +createOrder(userId: String, cartData: Cart) Order
        +cancelOrder(orderId: String) Boolean
    }

    class OrderController {
        -OrderService orderService
        +placeOrder(req: Request, res: Response) void
        +getOrderHistory(req: Request, res: Response) void
    }

    %% -------------------------------------------------------------
    %% RELATIONSHIPS & UML ASSOCIATIONS
    %% -------------------------------------------------------------
  
    %% INHERITANCE (<|--)
    BaseEntity <|-- User : is-a
    BaseEntity <|-- Restaurant : is-a
    BaseEntity <|-- MenuItem : is-a
    BaseEntity <|-- Cart : is-a
    BaseEntity <|-- Order : is-a
  
    %% REALIZATION / IMPLEMENTATION (<|..)
    IRepository <|.. OrderRepository : implements
  
    %% DEPENDENCY (..>)
    OrderController ..> OrderService : depends on
    OrderService ..> OrderRepository : depends on
    OrderService ..> PaymentStatus : uses
  
    %% COMPOSITION (*--)
    %% Strong lifecycle dependency (If Order is deleted, OrderItems are deleted)
    Order *-- "1..*" OrderItem : consists of
    Cart *-- "0..*" CartItem : consists of
  
    %% AGGREGATION (o--)
    %% Weak dependency (MenuItems can exist independently if a Restaurant closes temporarily)
    Restaurant o-- "0..*" MenuItem : offers
  
    %% NAVIGABLE ASSOCIATION (-->)
    %% Explicit direction of knowledge between domain aggregates
    Order --> "1" User : placed by
    Order --> "1" Restaurant : fulfills
    Order --> OrderStatus : has state
    Order --> PaymentStatus : has state
    Cart --> "1" User : relates to
    Cart --> "0..1" Restaurant : restricted to
  
    %% DIRECT ASSOCIATION (--)
    CartItem --> "1" MenuItem : references
    OrderItem --> "1" MenuItem : historically copies
```

## 3. Explaining the Class Diagram Relationships (For the Project Lead)

We explicitly applied several crucial **System Design principles** to make this diagram professional:

1. **Inheritance (`<|--`)**:
   * Models like `User`, `Restaurant`, `Order`, `Cart`, and `MenuItem` all inherit from `BaseEntity`. This is standard **OOP behavior** ensuring all our models uniformly get a unique ID (`_id`, UUID) and timestamps (`createdAt`, `updatedAt`).
2. **Composition (`*--`)**:
   * `Order` composed of `OrderItem`. Subdocuments physically do not exist outside the lifecycle of their parent document. If you delete an `Order`, the `OrderItems` perish.
   * `Cart` composed of `CartItem`.
3. **Aggregation (`o--`)**:
   * `Restaurant` aggregates `MenuItem`. While items belong to a restaurant, mathematically an item is its own autonomous record (own collection in MongoDB) that can be accessed and indexed separately.
4. **Realization/Implementation (`<|..`)**:
   * Added interfaces like `IRepository<T>` establishing a robust **Data Access pattern**. `OrderRepository` realizes this blueprint. This makes the database layer interchangeable (helpful for testing and TypeScript mocking).
5. **Dependency (`..>`)**:
   * Mapped standard **Controller-Service-Repository** architecture dependencies. The `OrderController` relies completely on the `OrderService` which contains business logic. Your controllers remain clean and merely handle HTTP streams.
6. **Navigable Association (`-->`)**:
   * Indicates one-way querying power. An **Order** inherently knows about the **User** and **Restaurant** that participated in the transaction.

## 4. Path to TypeScript Migration Strategy

When you transition to TypeScript, leverage the patterns detailed in this diagram:

* Define `export interface IBaseEntity` or an `abstract class` for your mongoose defaults.
* Enforce tight return types on Controllers using custom Express `Request/Response` interfaces.
* Extract the `.pre('save')` hooks and `Bcrypt` logic into specific `AuthService` utilities so Models are isolated exclusively for Schema mapping.

> *This diagram renders seamlessly directly on GitHub. Ensure Mermaid diagrams are supported in your Markdown preview configurations.*
