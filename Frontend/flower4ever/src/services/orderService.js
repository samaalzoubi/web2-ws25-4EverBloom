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

  // Get orders for specific customer
  async getCustomerOrders(userId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_ORDERS(userId));
      return this.transformBackendOrders(response.data);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  // Get orders for specific shop (for shop owners)
  async getShopOrders(shopId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHOP_ORDERS(shopId));
      return this.transformBackendOrders(response.data);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      throw error;
    }
  },

  // Update order (items, total, etc.)
  async updateOrder(orderId, orderData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDER_BY_ID(orderId), orderData);
      return this.transformBackendOrder(response.data);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Reorder - create new order from existing order
  async reorder(orderId, userId) {
    try {
      const originalOrder = await this.getOrder(orderId);
      const newOrderData = {
        items: originalOrder.items,
        total: originalOrder.total,
      };
      return await this.createOrder(userId, newOrderData.items, [], '');
    } catch (error) {
      console.error('Error reordering:', error);
      throw error;
    }
  },

  // Transform backend order data to frontend format
  transformBackendOrder(backendOrder) {
    // Transform orderLines/orderItems from backend to items array for frontend
    const orderItems = backendOrder.orderLines || backendOrder.orderItems || backendOrder.items || [];
    const transformedItems = orderItems.map(item => ({
      id: item.orderLineId || item.id,
      name: item.bouquetName || item.bouquet?.name || item.name || 'Unknown Item',
      quantity: item.quantity || 1,
      price: item.price || item.bouquet?.price || 0
    }));

    return {
      id: backendOrder.orderId || backendOrder.id,
      orderNumber: backendOrder.orderNumber || `ORD-${backendOrder.orderId || backendOrder.id}`,
      customerName: backendOrder.customer?.name || backendOrder.customerName || backendOrder.user?.name || 'Unknown',
      customerId: backendOrder.customerId || backendOrder.customer?.id || backendOrder.userId || backendOrder.user?.id,
      orderDate: backendOrder.orderDate || backendOrder.createdAt || new Date().toISOString(),
      status: backendOrder.status || 'CREATED',
      total: backendOrder.totalAmount || backendOrder.total || 0,
      items: transformedItems,
      rating: backendOrder.rating || null,
      rated: !!backendOrder.rating,
      deliveryAddress: backendOrder.address?.streetAddress || backendOrder.deliveryAddress || backendOrder.customer?.address || '',
      paymentMethod: backendOrder.paymentMethod || 'Card',
      customer: backendOrder.customer || {
        id: backendOrder.customerId || backendOrder.userId || backendOrder.customer?.id,
        name: backendOrder.customer?.name || backendOrder.customerName || 'Unknown',
        email: backendOrder.customer?.email || backendOrder.customerEmail || '',
        phone: backendOrder.customer?.phone || backendOrder.customerPhone || '',
        address: backendOrder.address?.streetAddress || backendOrder.deliveryAddress || backendOrder.customer?.address || ''
      }
    };
  },

  // Transform array of backend orders
  transformBackendOrders(backendOrders) {
    if (!Array.isArray(backendOrders)) {
      return [];
    }
    return backendOrders.map(order => this.transformBackendOrder(order));
  },

  async submitRating(orderId, customerId, ratingScore, review = '') {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RATING, {
        orderId,
        customerId,
        ratingScore,
        review
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
