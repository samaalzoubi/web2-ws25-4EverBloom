import { REST_BASE } from "/ClickPrototype/config/api.config.js";

/**
 * Fetch orders for a specific shop (owner view) using REST API
 * GET /api/v1/orders/shop/{shopId}
 */
export async function fetchOrdersForShopREST(shopId) {
  if (!shopId) {
    throw new Error("shopId is required to fetch shop orders");
  }

  const url = `${REST_BASE}/orders/shop/${shopId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
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
