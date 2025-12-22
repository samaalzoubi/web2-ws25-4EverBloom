# 🚀 Quick Start Guide

## Running Your Client-Side Rating Page

### ⚡ Fast Setup (3 steps)

1. **Start Backend**
   ```bash
   cd Backend/4EverBloom
   ./mvnw spring-boot:run
   ```
   Wait for: `Started Application in X seconds`

2. **Open in Live Server**
   - In VS Code, navigate to: `ClickPrototype/Rating/index.html`
   - Right-click → "Open with Live Server"

3. **Test!**
   - Browser opens automatically at `http://127.0.0.1:5500/ClickPrototype/Rating/index.html`
   - You should see your orders loaded via REST API
   - Click "Switch to GraphQL" to test GraphQL API
   - Rate an order by clicking stars and submitting

### ✅ Verify It's Working

Open browser DevTools (F12):

**Console should show:**
```
🚀 Initializing Customer Rating Application...
📡 Loading orders using REST API...
[REST] Fetching ratings for customer 1...
✅ Loaded X orders
✅ Application initialized successfully
```

**Network tab should show:**
- Request to `http://localhost:8080/api/v1/ratings/customer/1`
- Status: 200 OK

### 🔄 Test API Switching

1. Click "Switch to GraphQL" button
2. Console should show:
   ```
   🔄 Switching from REST to GRAPHQL...
   [GraphQL] Fetching orders for customer 1...
   ```
3. Network tab shows POST to `http://localhost:8080/graphql`

### ⭐ Test Rating Submission

1. Click on stars to rate (1-5)
2. Optionally add a review
3. Click "Submit Rating"
4. Success toast appears: "Thank you for your rating!"

### 🔍 Quick Debug

**No orders showing?**
```
Check: http://localhost:8080/api/v1/ratings/customer/1
Should return JSON array of ratings
```

**CORS error?**
```
Backend RatingController.java should have:
@CrossOrigin
@RestController
```

**Port 8080 already in use?**
```bash
# Find and kill the process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### 📱 Test URLs

- **REST API**: `http://127.0.0.1:5500/ClickPrototype/Rating/index.html`
- **GraphQL API**: `http://127.0.0.1:5500/ClickPrototype/Rating/index.html?api=graphql`
- **Different Customer**: `http://127.0.0.1:5500/ClickPrototype/Rating/index.html?customerId=2`

### 🎯 What You're Demonstrating

✅ Client and server running separately (Live Server vs Spring Boot)
✅ AJAX calls using Fetch API
✅ Both REST and GraphQL endpoints
✅ Client-side rendering with DOM API
✅ No server-side templates
✅ Dynamic API switching

---

**Need help?** Check the full README.md for detailed documentation.
