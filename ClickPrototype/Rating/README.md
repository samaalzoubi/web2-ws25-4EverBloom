# Customer Rating Page - Client-Side Rendering Implementation

## 📋 Lab Assignment 5 Implementation

This implementation demonstrates client-side rendering (CSR) for the Customer Rating page using vanilla JavaScript and native browser APIs.

## 🎯 Requirements Met

✅ **Requirement 1**: Separate client and server
- Client files are in `ClickPrototype/Rating/`
- Backend runs on Spring Boot (port 8080)
- Client runs on Live Server (typically port 5500)

✅ **Requirement 2**: AJAX calls to both REST and GraphQL APIs
- REST API: `/api/v1/ratings/*`
- GraphQL API: `/graphql`
- Dynamic switching between APIs

✅ **Requirement 3**: Client-side rendering using DOM API
- No server-side templates
- All HTML generation via JavaScript DOM manipulation

## 📁 Project Structure

```
ClickPrototype/Rating/
├── index.html              # Main HTML file (minimal, client-side rendered)
├── css/
│   └── rating-styles.css   # Styling for the page
└── js/
    ├── app.js              # Main application logic
    ├── api-config.js       # API configuration
    ├── rest-api.js         # REST API calls
    ├── graphql-api.js      # GraphQL API calls
    └── dom-renderer.js     # DOM manipulation and rendering
```

## 🚀 How to Run

### Step 1: Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend/4EverBloom
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or if using Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. Verify the backend is running at `http://localhost:8080`

### Step 2: Start the Client with Live Server

1. Open VS Code
2. Install the "Live Server" extension if you haven't:
   - Press `Ctrl+Shift+X`
   - Search for "Live Server"
   - Click Install

3. Navigate to `ClickPrototype/Rating/index.html`
4. Right-click on the file
5. Select "Open with Live Server"

The client will open in your browser at `http://127.0.0.1:5500/ClickPrototype/Rating/index.html`

## 🔄 API Switching

The application supports dynamic switching between REST and GraphQL APIs:

### Using REST API (Default)
- Simply open: `http://127.0.0.1:5500/ClickPrototype/Rating/index.html`
- Or click "Switch to GraphQL" button

### Using GraphQL API
- Open: `http://127.0.0.1:5500/ClickPrototype/Rating/index.html?api=graphql`
- Or click "Switch to REST" button

## 📡 API Endpoints Used

### REST API Endpoints

1. **Get ratings by customer**
   ```
   GET /api/v1/ratings/customer/{customerId}
   ```

2. **Get ratings by order**
   ```
   GET /api/v1/ratings/order/{orderId}
   ```

3. **Submit rating**
   ```
   POST /api/v1/ratings
   Body: {
     "orderId": 1,
     "customerId": 1,
     "ratingScore": 5,
     "review": "Great service!"
   }
   ```

### GraphQL Queries

1. **Get orders by customer**
   ```graphql
   query {
     ordersByCustomer(customerId: 1) {
       id
       orderDate
       totalPrice
       status
       orderLines {
         itemName
         quantity
         price
       }
     }
   }
   ```

2. **Get ratings by order**
   ```graphql
   query {
     ratingsByOrder(orderId: 1) {
       id
       ratingScore
       review
     }
   }
   ```

3. **Submit rating**
   ```graphql
   mutation {
     submitRating(input: {
       orderId: 1
       customerId: 1
       ratingScore: 5
       review: "Great service!"
     }) {
       id
       ratingScore
       review
     }
   }
   ```

## 🎨 Features

- **Dynamic Order Loading**: Orders are fetched from the backend and rendered client-side
- **Star Rating System**: Interactive 5-star rating with hover effects
- **Review Submission**: Optional text review with rating
- **API Switching**: Toggle between REST and GraphQL in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error messages and loading states
- **Success Feedback**: Toast notifications for successful submissions

## 🔧 Configuration

Edit `js/api-config.js` to change:
- API URLs
- Default customer ID
- Endpoint paths

```javascript
const API_CONFIG = {
    REST_BASE_URL: 'http://localhost:8080/api/v1',
    GRAPHQL_URL: 'http://localhost:8080/graphql',
    DEFAULT_CUSTOMER_ID: 1
};
```

## 🧪 Testing

1. **Test REST API**:
   - Open `http://127.0.0.1:5500/ClickPrototype/Rating/index.html`
   - Check browser console for REST API calls
   - Submit a rating

2. **Test GraphQL API**:
   - Click "Switch to GraphQL" button
   - Check browser console for GraphQL queries
   - Submit a rating

3. **Verify CORS**:
   - Check browser console for any CORS errors
   - Backend has `@CrossOrigin` annotation enabled

## 📝 Implementation Details

### Client-Side Rendering with DOM API

All HTML is generated dynamically using native DOM APIs:

```javascript
// Example from dom-renderer.js
function createOrderCard(order) {
  const card = document.createElement('div');
  card.className = 'order-card';
  
  const header = document.createElement('div');
  header.className = 'order-header';
  // ... more DOM manipulation
  
  card.appendChild(header);
  return card;
}
```

### AJAX with Fetch API

Both REST and GraphQL use the Fetch API:

```javascript
// REST example
const response = await fetch(`${API_BASE_URL}/ratings`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// GraphQL example
const response = await fetch(GRAPHQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables })
});
```

## 🐛 Troubleshooting

### Backend not responding
- Ensure Spring Boot is running on port 8080
- Check `http://localhost:8080/api/v1/ratings/customer/1`

### CORS errors
- Verify `@CrossOrigin` annotation is present in RatingController
- Check browser console for specific CORS messages

### No orders showing
- Check if the customer has any orders in the database
- Try with `?customerId=1` in the URL
- Open browser DevTools > Network tab to see API responses

### Live Server not working
- Install Live Server extension in VS Code
- Right-click on index.html and select "Open with Live Server"
- Check if another process is using port 5500

## 📚 Technologies Used

- **Vanilla JavaScript** (ES6 Modules)
- **Fetch API** (for AJAX)
- **DOM API** (for rendering)
- **CSS3** (with CSS Variables)
- **Spring Boot** (backend)
- **GraphQL** (Spring for GraphQL)

## 👥 Team Member

- **View Implemented**: Customer Rating Page
- **API Calls**: Both REST and GraphQL
- **Rendering**: Client-side using DOM API

## 📄 License

This is a lab assignment for Advanced Web Engineering course.
