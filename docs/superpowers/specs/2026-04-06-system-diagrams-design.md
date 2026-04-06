# System Diagrams Design

## Objective

Create a developer-facing Markdown document named `SYSTEM_DIAGRAMS.md` at the repository root. The document will describe the Eats system with three Mermaid diagrams:

1. Use case diagram
2. Class diagram
3. ER diagram

The output should be accurate to the current codebase while remaining readable for onboarding, reviews, and presentations.

## Audience

- Developers onboarding to the project
- Reviewers who need a quick system overview
- Stakeholders who need a concise technical summary

## Scope

### Included

- One Markdown file containing all three diagrams
- Short explanatory text before or after each diagram
- Diagram-to-code mapping notes based on the current backend models and API structure
- External payment actor for Razorpay in the use case diagram

### Excluded

- Full React component hierarchy
- Redux slice internals
- Helper-level implementation details such as JWT and bcrypt methods
- Deployment infrastructure diagrams
- Sequence diagrams or flowcharts

## Diagram Design

### 1. Use Case Diagram

Purpose:
Show the main user interactions with the platform at a business level.

Actors:
- Customer/User
- Razorpay

Use cases:
- Sign up
- Log in
- Browse restaurants
- View restaurant menu
- Manage cart
- Place order
- Make payment
- View order history
- Update profile
- Log out

Design rules:
- Keep the diagram simple and actor-focused
- Show Razorpay only where payment is involved
- Avoid backend or database detail in this diagram

### 2. Class Diagram

Purpose:
Show the logical structure of the core backend/domain entities and their relationships.

Classes to include:
- User
- Restaurant
- MenuItem
- Cart
- CartItem
- Order
- OrderItem

Relationship expectations:
- A `Restaurant` owns many `MenuItem` records
- A `User` has one `Cart`
- A `Cart` contains many `CartItem` entries
- A `User` places many `Order` records
- A `Restaurant` receives many `Order` records
- An `Order` contains many `OrderItem` entries
- `CartItem` and `OrderItem` reference `MenuItem` conceptually, while `OrderItem` also stores snapshot fields

Attribute strategy:
- Include only representative fields that explain the model
- Keep methods minimal; only mention model behaviors if they help understanding
- Prefer clarity over exhaustive schema reproduction

### 3. ER Diagram

Purpose:
Represent the persisted data structure closely enough to match the MongoDB models.

Entities:
- User
- Restaurant
- MenuItem
- Cart
- CartItem
- Order
- OrderItem

Relationship expectations:
- `User` 1 to 1 `Cart`
- `Restaurant` 1 to many `MenuItem`
- `User` 1 to many `Order`
- `Restaurant` 1 to many `Order`
- `Cart` 1 to many embedded `CartItem`
- `Order` 1 to many embedded `OrderItem`

MongoDB-specific treatment:
- Embedded arrays for `Cart.items` and `Order.orderItems` should be shown explicitly
- References by `ObjectId` should be represented as relationships
- Snapshot fields such as `restaurantName`, `itemName`, and `itemPrice` should appear where they clarify historical persistence behavior

## File Structure

Target output file:
- `SYSTEM_DIAGRAMS.md`

Document structure:
1. Title and short intro
2. Use case diagram with a short explanation
3. Class diagram with a short explanation
4. ER diagram with a short explanation
5. Brief note on how the diagrams map to the current codebase

## Content Standards

- Use Mermaid syntax that renders cleanly in common Markdown viewers
- Keep labels readable and consistent with the project terminology
- Prefer developer documentation tone over academic report wording
- Ensure each diagram can stand on its own for quick reading

## Risks And Mitigations

Risk:
Mermaid class diagrams can become cluttered if too many fields are included.

Mitigation:
Limit attributes to the fields that explain responsibility and relationships.

Risk:
MongoDB embedded subdocuments may be oversimplified.

Mitigation:
Show `CartItem` and `OrderItem` explicitly and describe them as embedded collections.

Risk:
Frontend-specific architecture may distract from the core domain.

Mitigation:
Keep the class and ER diagrams centered on backend/domain data while the use case diagram captures end-user behavior.

## Verification

The final document should be checked for:
- Mermaid syntax validity by visual inspection
- Alignment with `server/src/models/*.js`
- Consistency with the documented API flows in `PROJECT_OVERVIEW.md` and `README.md`

## Implementation Boundary

This design covers only the documentation artifact `SYSTEM_DIAGRAMS.md`. No application logic or schema changes are part of this work.
