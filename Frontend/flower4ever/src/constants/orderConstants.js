export const API_BASE_URL = 'http://localhost:8080/api/v1';

export const ORDER_STATUS = {
  CREATED: 'Created',
  CONFIRMED: 'Confirmed',
  IN_DELIVERY: 'In Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PAID: 'Paid',
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery'
};

export const API_ENDPOINTS = {
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
  CREATE_ORDER: (userId) => `/orders/${userId}`,
  RATING: '/ratings'
};
