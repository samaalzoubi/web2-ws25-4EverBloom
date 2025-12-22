/**
 * Main Application Module for Customer Rating Page
 * Coordinates between API calls and DOM rendering
 * Supports both REST and GraphQL APIs with dynamic switching
 */

import API_CONFIG from './api-config.js';
import { fetchOrdersREST, submitRatingREST, fetchCustomerRatingsREST } from './rest-api.js';
import { fetchOrdersGraphQL, submitRatingGraphQL } from './graphql-api.js';
import { renderOrders, showLoading, showError } from './dom-renderer.js';

// Application state
const AppState = {
    currentAPI: 'rest', // 'rest' or 'graphql'
    customerId: API_CONFIG.DEFAULT_CUSTOMER_ID,
    orders: [],
    ratings: new Map()
};

/**
 * Initialize the application
 */
async function init() {
    console.log('🚀 Initializing Customer Rating Application...');
    
    // Check URL parameters for API type
    const urlParams = new URLSearchParams(window.location.search);
    const apiType = urlParams.get('api');
    
    if (apiType === 'graphql') {
        AppState.currentAPI = 'graphql';
    }
    
    // Get customer ID from URL or use default
    const customerId = urlParams.get('customerId');
    if (customerId) {
        AppState.customerId = parseInt(customerId);
    }
    
    // Update UI to show current API
    updateAPIIndicator();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load orders
    await loadOrders();
    
    console.log('✅ Application initialized successfully');
}

/**
 * Load orders based on current API selection
 */
async function loadOrders() {
    try {
        showLoading();
        
        console.log(`📡 Loading orders using ${AppState.currentAPI.toUpperCase()} API...`);
        
        let orders;
        if (AppState.currentAPI === 'graphql') {
            orders = await fetchOrdersGraphQL(AppState.customerId);
        } else {
            // For REST, we'll combine orders with ratings
            orders = await fetchOrdersREST(AppState.customerId);
        }
        
        AppState.orders = orders;
        
        // Render orders to DOM
        renderOrders(orders);
        
        console.log(`✅ Loaded ${orders.length} orders`);
    } catch (error) {
        console.error('❌ Failed to load orders:', error);
        showError('Failed to load orders. Please check your connection and try again.');
    }
}

/**
 * Submit a rating
 */
async function submitRating(orderId) {
    try {
        // Get rating data from DOM
        const starsContainer = document.querySelector(`.stars[data-order-id="${orderId}"]`);
        const reviewTextarea = document.querySelector(`.rating-review[data-order-id="${orderId}"]`);
        const submitButton = document.querySelector(`.rating-submit-btn[data-order-id="${orderId}"]`);
        
        const ratingScore = parseInt(starsContainer.getAttribute('data-selected-rating'));
        const review = reviewTextarea.value.trim();
        
        // Validation
        if (!ratingScore || ratingScore < 1 || ratingScore > 5) {
            alert('Please select a rating between 1 and 5 stars');
            return;
        }
        
        // Prepare rating data
        const ratingData = {
            orderId: parseInt(orderId),
            customerId: AppState.customerId,
            ratingScore: ratingScore,
            review: review
        };
        
        console.log(`📤 Submitting rating using ${AppState.currentAPI.toUpperCase()} API:`, ratingData);
        
        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Submit using appropriate API
        let result;
        if (AppState.currentAPI === 'graphql') {
            result = await submitRatingGraphQL(ratingData);
        } else {
            result = await submitRatingREST(ratingData);
        }
        
        console.log('✅ Rating submitted successfully:', result);
        
        // Update UI
        submitButton.textContent = 'Rating Submitted!';
        submitButton.classList.add('success');
        reviewTextarea.disabled = true;
        
        // Store rating in state
        AppState.ratings.set(orderId, result);
        
        // Show success message
        showSuccessMessage('Thank you for your rating!');
        
    } catch (error) {
        console.error('❌ Failed to submit rating:', error);
        
        const submitButton = document.querySelector(`.rating-submit-btn[data-order-id="${orderId}"]`);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Rating';
        
        alert(`Failed to submit rating: ${error.message}`);
    }
}

/**
 * Switch between REST and GraphQL APIs
 */
async function switchAPI() {
    const newAPI = AppState.currentAPI === 'rest' ? 'graphql' : 'rest';
    
    console.log(`🔄 Switching from ${AppState.currentAPI.toUpperCase()} to ${newAPI.toUpperCase()}...`);
    
    AppState.currentAPI = newAPI;
    updateAPIIndicator();
    
    // Update URL without reloading
    const url = new URL(window.location);
    if (newAPI === 'graphql') {
        url.searchParams.set('api', 'graphql');
    } else {
        url.searchParams.delete('api');
    }
    window.history.pushState({}, '', url);
    
    // Reload orders with new API
    await loadOrders();
}

/**
 * Update API indicator in UI
 */
function updateAPIIndicator() {
    const indicator = document.getElementById('api-indicator');
    const toggleBtn = document.getElementById('toggle-api-btn');
    
    if (indicator) {
        indicator.textContent = AppState.currentAPI.toUpperCase();
        indicator.className = `api-badge api-${AppState.currentAPI}`;
    }
    
    if (toggleBtn) {
        const nextAPI = AppState.currentAPI === 'rest' ? 'GraphQL' : 'REST';
        toggleBtn.textContent = `Switch to ${nextAPI}`;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // API toggle button
    const toggleBtn = document.getElementById('toggle-api-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', switchAPI);
    }
    
    // Rating submit event
    document.addEventListener('rating-submit', (event) => {
        submitRating(event.detail.orderId);
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadOrders);
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        successDiv.classList.add('fade-out');
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for testing/debugging
export { AppState, loadOrders, submitRating, switchAPI };
