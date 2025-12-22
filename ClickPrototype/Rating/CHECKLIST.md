# ✅ Pre-Submission Checklist

Before submitting your Lab Assignment 5, verify all these items:

## 🔧 Setup Verification

### Backend Setup
- [ ] Backend is in `Backend/4EverBloom/` directory
- [ ] Spring Boot runs successfully: `./mvnw spring-boot:run`
- [ ] Backend starts on port 8080
- [ ] Console shows: "Started Application in X seconds"
- [ ] `@CrossOrigin` annotation added to RatingController

### Client Setup
- [ ] Client files are in `ClickPrototype/Rating/` directory
- [ ] Client is NOT in `Backend/` or served by Spring Boot
- [ ] Live Server extension is installed in VS Code
- [ ] Can open `index.html` with Live Server

## 🧪 Functionality Testing

### REST API
- [ ] Open `api-test.html` in browser
- [ ] Click "Test Backend" - shows ✅ SUCCESS
- [ ] Test "Get Ratings by Customer" - shows data
- [ ] Test "Submit Rating" via REST - creates new rating
- [ ] Check browser Network tab - see requests to `localhost:8080/api/v1/ratings`

### GraphQL API
- [ ] In `api-test.html`, test "Get Orders by Customer" - shows data
- [ ] Test "Get Ratings by Order" - shows data
- [ ] Test "Submit Rating" via GraphQL - creates new rating
- [ ] Check browser Network tab - see POST to `localhost:8080/graphql`

### Main Application
- [ ] Open `index.html` with Live Server
- [ ] Page loads without errors
- [ ] Orders appear automatically (using REST by default)
- [ ] Can see order cards with items
- [ ] Click "Switch to GraphQL" - page reloads with GraphQL data
- [ ] Can click on stars to rate (1-5)
- [ ] Can type in review textarea
- [ ] Click "Submit Rating" - shows success toast
- [ ] Check browser console - see API logs

## 🌐 Browser DevTools Verification

### Console Tab
- [ ] No red errors (warnings are OK)
- [ ] See: "🚀 Initializing Customer Rating Application..."
- [ ] See: "[REST] Fetching ratings for customer 1..." (or GraphQL equivalent)
- [ ] See: "✅ Loaded X orders"
- [ ] When switching APIs, see: "🔄 Switching from REST to GRAPHQL..."

### Network Tab
- [ ] REST mode shows: GET request to `/api/v1/ratings/customer/1`
- [ ] GraphQL mode shows: POST request to `/graphql`
- [ ] Requests show Status 200
- [ ] No CORS errors
- [ ] Can see request/response data

### Elements Tab
- [ ] HTML is dynamically generated (inspect order cards)
- [ ] No static order cards in original HTML
- [ ] Cards have class names like `order-card`, `rating-container`

## 📄 Code Review

### JavaScript Files
- [ ] `app.js` - main application logic exists
- [ ] `rest-api.js` - contains Fetch calls to REST API
- [ ] `graphql-api.js` - contains Fetch calls to GraphQL API
- [ ] `dom-renderer.js` - uses `createElement`, `appendChild`, etc.
- [ ] All files use ES6 modules (import/export)
- [ ] No jQuery or other libraries used

### HTML File
- [ ] `index.html` has minimal content
- [ ] Uses `<script type="module">` for JavaScript
- [ ] No hardcoded order data
- [ ] Has `<div id="orders-container">` for dynamic content

### CSS File
- [ ] `rating-styles.css` contains all styles
- [ ] Uses CSS variables
- [ ] Responsive design included

## 📚 Documentation

- [ ] `README.md` exists with full documentation
- [ ] `QUICK_START.md` has simple instructions
- [ ] `ASSIGNMENT_SUMMARY.md` lists all requirements met
- [ ] All markdown files are readable and formatted

## 🎯 Requirements Met

### Requirement 1: Separate Client/Server
- [ ] Client NOT served by Spring Boot
- [ ] Client runs on Live Server (different port)
- [ ] Can run client and server independently

### Requirement 2: AJAX Implementation
- [ ] At least one REST API call implemented
- [ ] At least one GraphQL API call implemented
- [ ] Uses Fetch API (no XMLHttpRequest)
- [ ] Can demonstrate both in action

### Requirement 3: Client-Side Rendering
- [ ] Uses `document.createElement()`
- [ ] Uses `element.appendChild()`
- [ ] Uses DOM API for all rendering
- [ ] No server-side templates (no Thymeleaf in client HTML)

## 📸 Evidence Collection

Prepare these screenshots for your report:

- [ ] Screenshot: Orders page showing data
- [ ] Screenshot: Browser console showing API logs
- [ ] Screenshot: Network tab showing REST request
- [ ] Screenshot: Network tab showing GraphQL request
- [ ] Screenshot: Rating submission success
- [ ] Screenshot: API test page with passing tests
- [ ] Screenshot: Code editor showing JavaScript modules
- [ ] Screenshot: Live Server status bar

## 🔍 Final Checks

### File Organization
- [ ] All client files in `ClickPrototype/Rating/`
- [ ] Backend files unchanged (except CORS annotation)
- [ ] No duplicate files
- [ ] Git repository is clean (if using git)

### Performance
- [ ] Page loads in under 3 seconds
- [ ] No infinite loops in console
- [ ] No memory leaks
- [ ] API calls complete successfully

### User Experience
- [ ] Loading spinner shows while fetching data
- [ ] Error messages display if API fails
- [ ] Success toast shows after rating submission
- [ ] Buttons are clickable and responsive
- [ ] Stars highlight on hover
- [ ] Page is visually appealing

## 🚀 Ready to Submit?

If all items above are checked ✅, you're ready to submit!

### Submission Package Should Include:

1. **Source Code**
   - All files in `ClickPrototype/Rating/` folder
   - Updated `RatingController.java` with @CrossOrigin

2. **Documentation**
   - README.md
   - QUICK_START.md
   - ASSIGNMENT_SUMMARY.md

3. **Evidence** (Screenshots/Video)
   - Application running
   - Browser DevTools showing API calls
   - Both REST and GraphQL working
   - API test page passing

4. **Instructions**
   - How to run the backend
   - How to run the client
   - How to test the functionality

---

## 🆘 Troubleshooting

If any item is unchecked, refer to:
- `QUICK_START.md` for setup issues
- `README.md` for detailed documentation
- `api-test.html` for API debugging
- Browser console for JavaScript errors
- Network tab for API issues

---

**Good luck with your submission! 🌸**
