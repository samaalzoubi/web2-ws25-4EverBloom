/**
 * API Configuration for Customer Rating Page
 * Centralized configuration for REST and GraphQL endpoints
 */

const API_CONFIG = {
    // Base URLs
    REST_BASE_URL: 'http://localhost:8080/api/v1',
    GRAPHQL_URL: 'http://localhost:8080/graphql',
    
    // Default customer ID (can be changed based on logged-in user)
    DEFAULT_CUSTOMER_ID: 1,
    
    // API endpoints
    endpoints: {
        ratings: '/ratings',
        ratingsByOrder: (orderId) => `/ratings/order/${orderId}`,
        ratingsByCustomer: (customerId) => `/ratings/customer/${customerId}`,
        submitRating: '/ratings'
    }
};

// Export for module usage
export default API_CONFIG;
