import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ORDER_STATUS } from '../constants/orderConstants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Get order by ID
  async getOrder(orderId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_BY_ID(orderId));
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Create a new order
  async createOrder(userId, bouquetIds, quantities, address) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_ORDER(userId), {
        bouquetIds,
        quantities,
        address
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.UPDATE_STATUS(orderId),
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Cancel order
  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
  },

  // Mock methods for features not yet in backend
  // TODO: Implement these in backend
  async getAllOrders() {
    // This would need a backend endpoint like GET /api/v1/orders
    console.warn('getAllOrders not yet implemented in backend');
    return this.getMockOrders();
  },

  async updateOrder(orderId, orderData) {
    // This would need a backend endpoint like PUT /api/v1/orders/{id}
    console.warn('updateOrder not yet implemented in backend');
    return orderData;
  },

  async submitRating(orderId, rating) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.RATING}`, {
        orderId,
        rating
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  },

  // Mock data helper (until backend endpoints are ready)
  getMockOrders() {
    return [
      {
        id: 'ORD-20240729-001',
        orderDate: '2024-07-29T10:30:00Z',
        items: [
          { name: 'Sunny Day Bouquet', price: 35.99, quantity: 1 },
          { name: 'Rose Garden Delight', price: 45.5, quantity: 2 }
        ],
        status: 'In Delivery',
        total: 127.99,
        rated: false
      },
      {
        id: 'ORD-20240728-004',
        orderDate: '2024-07-28T09:15:00Z',
        items: [
          { name: 'Wildflower Wonder', price: 29.99, quantity: 1 }
        ],
        status: 'Delivered',
        total: 29.99,
        rated: false
      },
      {
        id: 'ORD-20240727-006',
        orderDate: '2024-07-27T18:00:00Z',
        items: [
          { name: 'Tulip Treasure', price: 42.0, quantity: 1 }
        ],
        status: 'Created',
        total: 42.0,
        rated: false
      }
    ];
  }
};
