/**
 * GraphQL API Module for Customer Orders and Ratings
 * Handles all GraphQL queries and mutations using Fetch API
 */

import API_CONFIG from './api-config.js';

/**
 * Execute a GraphQL query or mutation
 */
async function executeGraphQL(query, variables = {}) {
    try {
        const response = await fetch(API_CONFIG.GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        return result.data;
    } catch (error) {
        console.error('[GraphQL] Error:', error);
        throw error;
    }
}

/**
 * Fetch orders for a specific customer using GraphQL
 */
export async function fetchOrdersGraphQL(customerId = API_CONFIG.DEFAULT_CUSTOMER_ID) {
    const query = `
        query OrdersByCustomer($customerId: ID!) {
            ordersByCustomer(customerId: $customerId) {
                id
                orderDate
                totalAmount
                status
                deliveryAddress
                items {
                    bouquetName
                    quantity
                    price
                }
            }
        }
    `;
    
    try {
        console.log(`[GraphQL] Fetching orders for customer ${customerId}...`);
        const data = await executeGraphQL(query, { customerId: customerId.toString() });
        console.log('[GraphQL] Raw response:', data);
        
        if (!data || !data.ordersByCustomer) {
            console.warn('[GraphQL] No orders found in response');
            return [];
        }
        
        console.log('[GraphQL] Orders fetched successfully:', data.ordersByCustomer);
        
        // Transform to match expected format
        const orders = data.ordersByCustomer.map(order => ({
            id: order.id,
            orderDate: order.orderDate,
            totalPrice: order.totalAmount,
            status: order.status,
            address: order.deliveryAddress,
            customerId: customerId,
            orderLines: (order.items || []).map(item => ({
                itemName: item.bouquetName,
                quantity: item.quantity,
                price: item.price
            }))
        }));
        
        return orders;
    } catch (error) {
        console.error('[GraphQL] Error fetching orders:', error);
        throw error;
    }
}

/**
 * Fetch ratings for a specific order using GraphQL
 */
export async function fetchRatingsByOrderGraphQL(orderId) {
    const query = `
        query RatingsByOrder($orderId: ID!) {
            ratingsByOrder(orderId: $orderId) {
                id
                ratingScore
                review
                orderId
                customerId
            }
        }
    `;
    
    try {
        console.log(`[GraphQL] Fetching ratings for order ${orderId}...`);
        const data = await executeGraphQL(query, { orderId: orderId.toString() });
        console.log('[GraphQL] Ratings fetched successfully:', data.ratingsByOrder);
        return data.ratingsByOrder;
    } catch (error) {
        console.error('[GraphQL] Error fetching ratings:', error);
        throw error;
    }
}

/**
 * Submit a new rating using GraphQL mutation
 */
export async function submitRatingGraphQL(ratingData) {
    const mutation = `
        mutation SubmitRating($input: RatingInput!) {
            submitRating(input: $input) {
                id
                ratingScore
                review
                orderId
                customerId
            }
        }
    `;
    
    const input = {
        orderId: ratingData.orderId.toString(),
        customerId: ratingData.customerId.toString(),
        ratingScore: ratingData.ratingScore,
        review: ratingData.review || ""
    };
    
    try {
        console.log('[GraphQL] Submitting rating:', input);
        const data = await executeGraphQL(mutation, { input });
        console.log('[GraphQL] Rating submitted successfully:', data.submitRating);
        return data.submitRating;
    } catch (error) {
        console.error('[GraphQL] Error submitting rating:', error);
        throw error;
    }
}
