## Use Case Diagram - Eats Food Delivery System

> Note: Proper UML Use Case diagrams are not supported by GitHub Markdown.  
> Below is a GitHub-compatible version.

```mermaid
graph TD

    %% Actors
    C[Customer]
    S[System]
    P[Razorpay Payment Gateway]
    I[Cloudinary Image Storage]

    %% Identity Management
    subgraph Identity_Management
        UC1[Sign Up]
        UC2[Login]
        UC3[Update Profile]
        UC3a[Upload Profile Image]
        UC4[Logout]
    end

    %% Discovery
    subgraph Discovery
        UC5[Browse Restaurants]
        UC6[Search / Filter Cuisine]
        UC7[View Menu]
    end

    %% Orders
    subgraph Orders
        UC8[Manage Cart]
        UC8a[Sync Cart with Database]
        UC9[Place Order]
        UC10[Process Payment]
        UC11[View Order History]
    end

    %% Customer interactions
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

    %% Relationships
    UC3 --> UC3a
    UC8 --> UC8a
    UC9 --> UC10

    %% External systems
    UC3a --> I
    UC10 --> P
    UC8a --> S
