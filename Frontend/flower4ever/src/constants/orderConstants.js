export const API_BASE_URL = 'http://localhost:8080/api/v1';

export const ORDER_STATUS = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  IN_DELIVERY: 'IN_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  PAID: 'PAID',
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY'
};

export const API_ENDPOINTS = {
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
  CREATE_ORDER: (userId) => `/orders/${userId}`,
  CUSTOMER_ORDERS: (customerId) => `/orders/customer/${customerId}`,
  SHOP_ORDERS: (shopId) => `/orders/shop/${shopId}`,
  RATING: '/ratings'
};
