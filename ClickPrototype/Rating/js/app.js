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
    customerId: API_CONFIG.DEFAULT_CUSTOMER_ID,
    orders: [],
    ratings: new Map(),
    apiResults: {
        rest: null,
        graphql: null
    }
};

/**
 * Initialize the application
 */
async function init() {
    console.log('🚀 Initializing Customer Rating Application...');
    
    // Get customer ID from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    if (customerId) {
        AppState.customerId = parseInt(customerId);
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Load orders from both APIs
    await loadOrders();
    
    console.log('✅ Application initialized successfully');
}

/**
 * Load orders from both REST and GraphQL APIs automatically
 */
async function loadOrders() {
    try {
        showLoading();
        
        console.log('📡 Loading orders using both REST and GraphQL APIs...');
        
        // Fetch from both APIs in parallel
        const [restOrders, graphqlOrders] = await Promise.allSettled([
            fetchOrdersREST(AppState.customerId),
            fetchOrdersGraphQL(AppState.customerId)
        ]);
        
        // Store API results
        AppState.apiResults.rest = restOrders.status === 'fulfilled' ? restOrders.value : null;
        AppState.apiResults.graphql = graphqlOrders.status === 'fulfilled' ? graphqlOrders.value : null;
        
        // Log results from both APIs
        if (restOrders.status === 'fulfilled') {
            console.log(`✅ REST API: Loaded ${restOrders.value.length} orders`);
        } else {
            console.warn('⚠️ REST API failed:', restOrders.reason);
        }
        
        if (graphqlOrders.status === 'fulfilled') {
            console.log(`✅ GraphQL API: Loaded ${graphqlOrders.value.length} orders`);
        } else {
            console.warn('⚠️ GraphQL API failed:', graphqlOrders.reason);
        }
        
        // Use GraphQL data as primary source, fallback to REST if needed
        let orders = [];
        if (AppState.apiResults.graphql && AppState.apiResults.graphql.length > 0) {
            orders = AppState.apiResults.graphql;
            console.log('📊 Using GraphQL data as primary source');
        } else if (AppState.apiResults.rest && AppState.apiResults.rest.length > 0) {
            orders = AppState.apiResults.rest;
            console.log('📊 Using REST data as fallback');
        }
        
        AppState.orders = orders;
        
        // Render orders to DOM
        renderOrders(orders);
        
        console.log(`✅ Loaded ${orders.length} orders total`);
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
        
        console.log('📤 Submitting rating:', ratingData);
        
        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Try GraphQL first, fallback to REST
        let result;
        try {
            result = await submitRatingGraphQL(ratingData);
            console.log('✅ Rating submitted via GraphQL');
        } catch (graphqlError) {
            console.warn('⚠️ GraphQL submission failed, trying REST:', graphqlError);
            result = await submitRatingREST(ratingData);
            console.log('✅ Rating submitted via REST');
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
 * Setup event listeners
 */
function setupEventListeners() {
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
export { AppState, loadOrders, submitRating };
