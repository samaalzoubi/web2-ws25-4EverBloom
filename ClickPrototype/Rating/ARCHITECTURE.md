# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                        │
│                     http://127.0.0.1:5500                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    index.html                           │  │
│  │              (Minimal HTML Structure)                   │  │
│  │                                                         │  │
│  │  <div id="orders-container">                           │  │
│  │    <!-- Populated by JavaScript -->                     │  │
│  │  </div>                                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              JavaScript Modules                         │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   app.js     │  │ rest-api.js  │  │graphql-api.js│ │  │
│  │  │              │  │              │  │              │ │  │
│  │  │ - Init       │  │ - Fetch API  │  │ - Fetch API  │ │  │
│  │  │ - Events     │  │ - REST calls │  │ - GraphQL    │ │  │
│  │  │ - State      │  │              │  │   queries    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐                   │  │
│  │  │dom-renderer  │  │ api-config   │                   │  │
│  │  │              │  │              │                   │  │
│  │  │ - DOM API    │  │ - Config     │                   │  │
│  │  │ - Create     │  │ - URLs       │                   │  │
│  │  │   Elements   │  │              │                   │  │
│  │  └──────────────┘  └──────────────┘                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ AJAX Calls (Fetch API)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Spring Boot)                  │
│                     http://localhost:8080                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐         ┌─────────────────────────┐  │
│  │   REST Controller   │         │  GraphQL Controller     │  │
│  │                     │         │                         │  │
│  │  @CrossOrigin       │         │  @Controller            │  │
│  │  @RestController    │         │                         │  │
│  │                     │         │  Queries:               │  │
│  │  GET /api/v1/       │         │  - ordersByCustomer     │  │
│  │    ratings/         │         │  - ratingsByOrder       │  │
│  │    customer/{id}    │         │                         │  │
│  │                     │         │  Mutations:             │  │
│  │  POST /api/v1/      │         │  - submitRating         │  │
│  │    ratings          │         │                         │  │
│  └─────────────────────┘         └─────────────────────────┘  │
│            │                                │                  │
│            └────────────┬───────────────────┘                  │
│                         │                                      │
│                         ▼                                      │
│              ┌─────────────────────┐                          │
│              │  RatingService      │                          │
│              │                     │                          │
│              │  - saveRating()     │                          │
│              │  - getRatings()     │                          │
│              └─────────────────────┘                          │
│                         │                                      │
│                         ▼                                      │
│              ┌─────────────────────┐                          │
│              │   Database (JPA)    │                          │
│              │                     │                          │
│              │  - Order            │                          │
│              │  - Rating           │                          │
│              │  - Customer         │                          │
│              └─────────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Flow 1: Loading Orders (REST API)

```
User Opens Page
    │
    ▼
app.js init()
    │
    ▼
Calls loadOrders()
    │
    ▼
rest-api.js fetchOrdersREST()
    │
    ├─→ Fetch GET /api/v1/ratings/customer/1
    │       │
    │       ▼
    │   RatingController.getRatingsByCustomer()
    │       │
    │       ▼
    │   RatingService.getRatingsByCustomerId()
    │       │
    │       ▼
    │   Database Query
    │       │
    │       ▼
    │   Returns JSON: [{ id, score, review, orderId, customerId }]
    │       │
    ▼       ▼
Transform to orders
    │
    ▼
dom-renderer.js renderOrders()
    │
    ├─→ createElement('div')
    ├─→ createElement('h3')
    ├─→ appendChild()
    │
    ▼
DOM Updated - User Sees Orders
```

### Flow 2: Loading Orders (GraphQL API)

```
User Clicks "Switch to GraphQL"
    │
    ▼
app.js switchAPI()
    │
    ▼
Calls loadOrders()
    │
    ▼
graphql-api.js fetchOrdersGraphQL()
    │
    ├─→ Fetch POST /graphql
    │   Body: { query: "ordersByCustomer...", variables: { customerId } }
    │       │
    │       ▼
    │   OrderRatingGraphQLController
    │       │
    │       ▼
    │   ordersByCustomer() method
    │       │
    │       ▼
    │   OrderRepository.findByCustomer_Id()
    │       │
    │       ▼
    │   Returns: { data: { ordersByCustomer: [...] } }
    │       │
    ▼       ▼
Transform to expected format
    │
    ▼
dom-renderer.js renderOrders()
    │
    ├─→ createElement('div')
    ├─→ appendChild()
    │
    ▼
DOM Updated - User Sees Orders
```

### Flow 3: Submitting a Rating (REST)

```
User Clicks Stars (5★)
    │
    ▼
dom-renderer.js handleStarClick()
    │
    ├─→ Add 'active' class to stars
    ├─→ Set data-selected-rating="5"
    │
User Types Review "Great!"
    │
User Clicks "Submit Rating"
    │
    ▼
dom-renderer.js handleRatingSubmit()
    │
    ├─→ Dispatch custom event 'rating-submit'
    │
    ▼
app.js submitRating()
    │
    ├─→ Get rating data from DOM
    ├─→ Validate (1-5 stars)
    │
    ▼
rest-api.js submitRatingREST()
    │
    ├─→ Fetch POST /api/v1/ratings
    │   Body: { orderId, customerId, ratingScore: 5, review: "Great!" }
    │       │
    │       ▼
    │   RatingController.submitRating()
    │       │
    │       ▼
    │   RatingService.saveRating()
    │       │
    │       ▼
    │   Database INSERT
    │       │
    │       ▼
    │   Returns: { id: 123, ratingScore: 5, review: "Great!", ... }
    │       │
    ▼       ▼
Update UI
    │
    ├─→ Disable submit button
    ├─→ Change text to "Rating Submitted!"
    ├─→ Show success toast
    │
    ▼
User Sees Success Message
```

## Technology Stack Map

```
┌─────────────────────────────────────────────────────┐
│                   Client-Side                       │
├─────────────────────────────────────────────────────┤
│ Language:        JavaScript (ES6)                   │
│ Module System:   ES6 Modules (import/export)        │
│ AJAX:            Fetch API                          │
│ Rendering:       Native DOM API                     │
│ Styling:         CSS3 + CSS Variables               │
│ Server:          Live Server (VS Code)              │
│ Port:            5500 (default)                     │
│ Libraries:       NONE (vanilla JS only)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   Server-Side                       │
├─────────────────────────────────────────────────────┤
│ Framework:       Spring Boot 3.x                    │
│ Language:        Java                               │
│ REST:            Spring MVC (@RestController)       │
│ GraphQL:         Spring for GraphQL                 │
│ Database:        JPA/Hibernate                      │
│ CORS:            @CrossOrigin                       │
│ Port:            8080                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   Communication                     │
├─────────────────────────────────────────────────────┤
│ Protocol:        HTTP/HTTPS                         │
│ Format:          JSON                               │
│ Methods:         GET, POST                          │
│ APIs:            REST + GraphQL                     │
│ CORS:            Enabled                            │
└─────────────────────────────────────────────────────┘
```

## File Dependency Graph

```
index.html
    │
    └─→ app.js (type="module")
            │
            ├─→ api-config.js
            │       └─→ exports: API_CONFIG
            │
            ├─→ rest-api.js
            │       ├─→ imports: API_CONFIG
            │       └─→ exports: fetchOrdersREST, submitRatingREST
            │
            ├─→ graphql-api.js
            │       ├─→ imports: API_CONFIG
            │       └─→ exports: fetchOrdersGraphQL, submitRatingGraphQL
            │
            └─→ dom-renderer.js
                    └─→ exports: renderOrders, showLoading, showError
```

## Key Principles Demonstrated

### 1. Separation of Concerns
```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│     View     │   │  Controller  │   │    Model     │
│ (DOM/HTML)   │◄──│ (JavaScript) │◄──│   (API)      │
│              │   │              │   │              │
│ dom-renderer │   │    app.js    │   │ rest-api.js  │
│              │   │              │   │ graphql-api  │
└──────────────┘   └──────────────┘   └──────────────┘
```

### 2. Client-Server Architecture
```
CLIENT (Port 5500)          SERVER (Port 8080)
─────────────────          ──────────────────
HTML + CSS + JS    ◄────►  Spring Boot
Live Server               Java Backend
No Backend Logic          No Frontend Logic
```

### 3. API Abstraction
```
app.js
   │
   ├─ Uses: loadOrders()
   │
   ▼
Switch determines API
   │
   ├─► REST:    rest-api.js
   │              └─→ /api/v1/ratings
   │
   └─► GraphQL: graphql-api.js
                  └─→ /graphql
```

This architecture ensures:
✅ Clear separation of client and server
✅ Easy API switching
✅ Maintainable code structure
✅ Testable components
