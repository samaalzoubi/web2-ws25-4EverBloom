/**
 * REST API Module for Customer Orders and Ratings
 * Handles all REST API calls using Fetch API
 */

import API_CONFIG from './api-config.js';

/**
 * Fetch orders for a specific customer using REST API
 */
export async function fetchOrdersREST(customerId = API_CONFIG.DEFAULT_CUSTOMER_ID) {
    try {
        console.log(`[REST] Fetching orders for customer ${customerId}...`);
        
        // Use the actual orders endpoint with userId query parameter
        const response = await fetch(
            `${API_CONFIG.REST_BASE_URL}/orders?userId=${customerId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const orders = await response.json();
        console.log('[REST] Orders fetched successfully:', orders);
        
        // Transform orders to match expected format
        return orders.map(order => ({
            id: order.orderId,
            customerId: order.customerId,
            orderDate: order.orderDate,
            status: order.status,
            totalPrice: order.totalAmount,
            address: order.address,
            orderLines: order.orderLines || []
        }));
    } catch (error) {
        console.error('[REST] Error fetching orders:', error);
        throw error;
    }
}

/**
 * Fetch ratings for a specific order using REST API
 */
export async function fetchRatingsByOrderREST(orderId) {
    try {
        console.log(`[REST] Fetching ratings for order ${orderId}...`);
        
        const response = await fetch(
            `${API_CONFIG.REST_BASE_URL}${API_CONFIG.endpoints.ratingsByOrder(orderId)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const ratings = await response.json();
        console.log('[REST] Ratings fetched successfully:', ratings);
        return ratings;
    } catch (error) {
        console.error('[REST] Error fetching ratings:', error);
        throw error;
    }
}

/**
 * Submit a new rating using REST API
 */
export async function submitRatingREST(ratingData) {
    try {
        console.log('[REST] Submitting rating:', ratingData);
        
        const response = await fetch(
            `${API_CONFIG.REST_BASE_URL}${API_CONFIG.endpoints.submitRating}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(ratingData)
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('[REST] Rating submitted successfully:', result);
        return result;
    } catch (error) {
        console.error('[REST] Error submitting rating:', error);
        throw error;
    }
}

/**
 * Fetch all ratings for a customer using REST API
 */
export async function fetchCustomerRatingsREST(customerId = API_CONFIG.DEFAULT_CUSTOMER_ID) {
    try {
        console.log(`[REST] Fetching ratings for customer ${customerId}...`);
        
        const response = await fetch(
            `${API_CONFIG.REST_BASE_URL}${API_CONFIG.endpoints.ratingsByCustomer(customerId)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const ratings = await response.json();
        console.log('[REST] Customer ratings fetched successfully:', ratings);
        return ratings;
    } catch (error) {
        console.error('[REST] Error fetching customer ratings:', error);
        throw error;
    }
}
