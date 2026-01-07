import { REST_BASE } from "/ClickPrototype/config/api.config.js";

/**
 * Fetch all orders for a specific customer using REST API
 * GET /api/v1/orders?userId={customerId}
 */
export async function fetchOrdersByCustomerREST(customerId) {
  const url = `${REST_BASE}/orders?userId=${customerId}`;
  
  console.log('Fetching orders from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) {
    throw new Error(`REST failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Orders data received:', data);
  return data;
}

/**
 * Fetch single order details using REST API
 * GET /api/v1/orders/{orderId}
 */
export async function fetchOrderDetailsREST(orderId) {
  const url = `${REST_BASE}/orders/${orderId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update order status using REST API
 * PATCH /api/v1/orders/{orderId}/status?status={status}
 */
export async function updateOrderStatusREST(orderId, status) {
  const url = `${REST_BASE}/orders/${orderId}/status?status=${status}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Create a new order using REST API
 * POST /api/v1/orders/{userId}
 */
export async function createOrderREST(userId, bouquetIds, quantities, address) {
  const url = `${REST_BASE}/orders/${userId}`;

  const payload = {
    bouquetIds,
    quantities,
    address
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
/**
 * Submit a rating using REST API
 * POST /api/v1/ratings
 */
export async function submitRatingREST(orderId, customerId, ratingScore, review = null) {
  const url = `${REST_BASE}/ratings`;

  const payload = {
    orderId: orderId,
    customerId: customerId,
    ratingScore: ratingScore,
    review: review
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}