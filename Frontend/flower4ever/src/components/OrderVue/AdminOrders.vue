<template>
  <div class="admin-orders-page">
    <div class="orders-container">
      <!-- Header -->
      <div class="customer-header">
       
         <h1>Customer Orders Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      <!-- Stats Overview -->
      <div v-if="!loading && orders.length > 0" class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">{{ formatCurrency(stats.revenue) }}</div>
          <div class="stat-label">Total Spent</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👨‍🍳</div>
          <div class="stat-value">{{ stats.preparing }}</div>
          <div class="stat-label">Preparing</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-bar">
        <input
          v-model="searchTerm"
          class="search-input"
          placeholder="Search orders..."
          @input="filterOrders"
        />
        <select v-model="selectedStatus" class="filter-select" @change="filterOrders">
          <option value="all">All Statuses</option>
          <option v-for="status in allStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">Loading orders...</div>

      <!-- Error -->
      <div v-else-if="error" class="error">{{ error }}</div>

      <!-- Empty -->
      <div v-else-if="filteredOrders.length === 0" class="no-orders">
        No orders found.
      </div>

      <!-- Orders Grid -->
      <div v-else class="orders-grid">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div>
              <div class="order-id">{{ order.id }}</div>
              <div class="order-date">{{ formatDate(order.orderDate) }}</div>
            </div>
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>

          <div class="order-customer">{{ order.customer?.name || 'Unknown' }}</div>

          <div class="order-items">
            <div v-if="order.items && order.items.length > 0">
              <div v-for="(item, index) in order.items" :key="item.id || item.name || index" class="order-item">
                <span>{{ item.name || 'Unknown Item' }}</span>
                <span class="item-quantity">×{{ item.quantity || 0 }}</span>
              </div>
            </div>
            <div v-else class="no-items">No items</div>
          </div>

          <div class="order-total">{{ formatCurrency(order.total) }}</div>

          <div class="order-rating">
            <template v-if="order.rating">
              <span class="rating-label">Rate:</span>
              <span class="rating-value">{{ order.rating }} out of 5</span>
              <span class="rating-stars">{{ getStarDisplay(order.rating) }}</span>
            </template>
            <template v-else-if="order.status === 'Delivered'">
              <span class="rating-label">Rate:</span>
              <span class="rating-not-rated">Not rated yet</span>
            </template>
          </div>

          <div class="order-actions">
            <!-- Accept button to progress order status -->
            <button
              v-if="canAccept(order)"
              class="btn-accept"
              @click="acceptOrder(order)"
            >
              <i class="fas fa-check"></i> {{ getAcceptButtonText(order.status) }}
            </button>

            <button
              v-if="canCancel(order)"
              class="cancel-btn"
              @click="handleCancelOrder(order.id)"
            >
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEdit" class="modal-overlay active">
        <div class="modal-content">
          <h2>Edit Order {{ editOrder.id }}</h2>

          <div v-for="(item, index) in editOrder.items" :key="index" class="edit-item">
            <span>{{ item.name }} — {{ formatCurrency(item.price) }}</span>
            <div class="edit-item-controls">
              <button @click="updateQuantity(item.name, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item.name, 1)">+</button>
              <button
                v-if="editOrder.items.length > 1"
                class="delete-btn"
                @click="deleteItem(item.name)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <button class="add-item-btn" @click="addNewItemToEdit">
            <i class="fas fa-plus"></i> Add Item
          </button>

          <div class="edit-total">Total: {{ formatCurrency(editOrder.total) }}</div>

          <div class="modal-actions">
            <button class="btn-save" @click="saveEdit">Save Changes</button>
            <button class="btn-close" @click="closeEdit">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Chatbot -->
      <Chatbot />
    </div>
  </div>
</template>

<script>
import Chatbot from './Chatbot.vue';
import orderService from '@/services/orderService';

// Order Statuses
const OrderStatus = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "In Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Available Items
const AVAILABLE_ITEMS = [
  { name: "Sunny Day Bouquet", price: 35.99 },
  { name: "Rose Garden Delight", price: 45.5 },
  { name: "Wildflower Wonder", price: 29.99 },
  { name: "Tulip Treasure", price: 42.0 },
  { name: "Orchid Oasis", price: 55.75 },
  { name: "Minimalist White", price: 38.0 },
];

// Utility Functions
const formatCurrency = (a) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(a);

const formatDate = (d) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

const getStatusClass = (status) =>
  ({
    Pending: "status-pending",
    Preparing: "status-preparing",
    "Out for Delivery": "status-out",
    Delivered: "status-delivered",
    Cancelled: "status-cancelled",
  }[status] || "");

const calculateTotal = (items) =>
  items.reduce((t, i) => t + i.price * i.quantity, 0);

const getAllStatuses = () => Object.values(OrderStatus);

// Mock Customers
const mockCustomers = [
  { id: "CUST-001", name: "Alice Johnson", email: "alice@example.com", phone: "+1 234 567 8900", address: "123 Flower St, City" },
  { id: "CUST-002", name: "Bob Williams", email: "bob@example.com", phone: "+1 234 567 8901", address: "456 Garden Ave, City" },
  { id: "CUST-003", name: "Charlie Brown", email: "charlie@example.com", phone: "+1 234 567 8902", address: "789 Rose Lane, City" },
];

// Generate Order Items
const generateOrderItems = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const itemTemplate = AVAILABLE_ITEMS[Math.floor(Math.random() * AVAILABLE_ITEMS.length)];
    const existing = items.find((x) => x.name === itemTemplate.name);
    if (existing) existing.quantity += 1;
    else items.push({
      id: `ITEM-${Date.now()}-${i}`,
      ...itemTemplate,
      quantity: Math.floor(Math.random() * 3) + 1,
    });
  }
  return items;
};

// Mock Orders
const MOCK_ORDERS = [
  { id: "ORD-20240729-001", customer: mockCustomers[0], orderDate: "2024-07-29T10:30:00Z", items: generateOrderItems(2), status: OrderStatus.PENDING, notes: "Handle with care" },
  { id: "ORD-20240729-002", customer: mockCustomers[1], orderDate: "2024-07-29T11:45:00Z", items: generateOrderItems(1), status: OrderStatus.PREPARING, notes: "" },
  { id: "ORD-20240728-003", customer: mockCustomers[2], orderDate: "2024-07-28T14:00:00Z", items: generateOrderItems(3), status: OrderStatus.OUT_FOR_DELIVERY, notes: "Gift message" },
  { id: "ORD-20240728-004", customer: mockCustomers[0], orderDate: "2024-07-28T09:15:00Z", items: generateOrderItems(1), status: OrderStatus.DELIVERED, notes: "" },
  { id: "ORD-20240727-005", customer: mockCustomers[1], orderDate: "2024-07-27T16:30:00Z", items: generateOrderItems(2), status: OrderStatus.DELIVERED, notes: "" },
].map(o => ({ ...o, total: calculateTotal(o.items) }));

export default {
  name: 'CustomerOrders',
  components: { 
    Chatbot 
  },
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: false,
      error: null,
      searchTerm: '',
      selectedStatus: 'all',
      showEdit: false,
      editOrder: null,
      customerName: 'Customer',
      userId: null
    };
  },
  computed: {
    allStatuses() {
      return getAllStatuses();
    },
    stats() {
      return {
        total: this.orders.length,
        revenue: this.orders.reduce((sum, order) => sum + order.total, 0),
        pending: this.orders.filter(o => o.status === OrderStatus.PENDING).length,
        preparing: this.orders.filter(o => o.status === OrderStatus.PREPARING).length
      };
    }
  },
  async mounted() {
    // TODO: Get userId from your authentication system
    this.userId = this.getUserId();
    await this.loadOrders();
  },
  methods: {
    formatCurrency,
    formatDate,
    getStatusClass,

    getStarDisplay(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      let stars = '⭐'.repeat(fullStars);
      if (hasHalfStar) stars += '✨';
      return stars;
    },

    getUserId() {
      // TODO: Replace with actual authentication logic
      return localStorage.getItem('userId') || 1;
    },

    async loadOrders() {
      try {
        this.loading = true;
        this.error = null;
        
        // ✅ NOW USING REAL BACKEND API
        this.orders = await orderService.getCustomerOrders(this.userId);
        
        // Debug: Log orders to verify structure
        console.log('Loaded orders:', this.orders);
        console.log('First order items:', this.orders[0]?.items);
        
        // Get customer name from first order or default
        if (this.orders.length > 0) {
          this.customerName = this.orders[0].customerName || 'Customer';
        }
        
        this.filterOrders();
      } catch (err) {
        this.error = 'Failed to load your orders';
        console.error('Error loading customer orders:', err);
      } finally {
        this.loading = false;
      }
    },

    filterOrders() {
      let filtered = [...this.orders];

      if (this.searchTerm) {
        filtered = filtered.filter(
          (o) =>
            o.customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            o.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            o.customer.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.selectedStatus !== "all") {
        filtered = filtered.filter((o) => o.status === this.selectedStatus);
      }

      this.filteredOrders = filtered;
    },

    viewDetails(order) {
      this.$router.push(`/orders/${order.id}`);
    },

    canAccept(order) {
      // Can accept if order is in a status that can be progressed
      const progressableStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'CREATED', 'Created', 'In Delivery', 'IN DELIVERY'];
      console.log('canAccept check - Order:', order.id, 'Status:', order.status, 'Can accept:', progressableStatuses.includes(order.status));
      return progressableStatuses.includes(order.status);
    },

    getAcceptButtonText(status) {
      const statusMap = {
        'Pending': 'Start Preparing',
        'Preparing': 'Send for Delivery',
        'Out for Delivery': 'Mark Delivered',
        'CREATED': 'Accept Order',
        'Created': 'Accept Order',
        'In Delivery': 'Mark Delivered',
        'IN DELIVERY': 'Mark Delivered'
      };
      return statusMap[status] || 'Accept';
    },

    getNextStatus(currentStatus) {
      const statusFlow = {
        'Pending': 'Preparing',
        'Preparing': 'Out for Delivery',
        'Out for Delivery': 'Delivered',
        'CREATED': 'Preparing',
        'Created': 'Preparing',
        'In Delivery': 'Delivered',
        'IN DELIVERY': 'Delivered'
      };
      return statusFlow[currentStatus] || currentStatus;
    },

    async acceptOrder(order) {
      const nextStatus = this.getNextStatus(order.status);
      const buttonText = this.getAcceptButtonText(order.status);
      
      if (!confirm(`${buttonText}? This will change the order status to "${nextStatus}".`)) {
        return;
      }

      try {
        // ✅ NOW USING REAL BACKEND API
        await orderService.updateOrderStatus(order.id, nextStatus);
        order.status = nextStatus;
        this.filterOrders();
        alert(`Order ${order.id} status updated to ${nextStatus}!`);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. Please try again.');
      }
    },

    canCancel(order) {
      return order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;
    },

    async handleCancelOrder(id) {
      const order = this.orders.find((o) => o.id === id);
      if (!order) {
        alert("Order not found.");
        return;
      }

      if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
        alert("This order cannot be modified.");
        return;
      }

      if (confirm("Are you sure you want to cancel this order?")) {
        try {
          // ✅ NOW USING REAL BACKEND API
          await orderService.cancelOrder(id);
          order.status = OrderStatus.CANCELLED;
          this.filterOrders();
          alert(`Order ${id} has been cancelled.`);
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      }
    },

    openEdit(id) {
      const o = this.orders.find((x) => x.id === id);
      if (!o) return;
      if (o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED) {
        alert("This order cannot be edited.");
        return;
      }

      this.editOrder = JSON.parse(JSON.stringify(o));
      this.showEdit = true;
    },

    closeEdit() {
      this.showEdit = false;
    },

    updateQuantity(name, delta) {
      const item = this.editOrder.items.find((i) => i.name === name);
      if (!item) return;
      item.quantity = Math.max(1, item.quantity + delta);
      this.editOrder.total = calculateTotal(this.editOrder.items);
    },

    deleteItem(name) {
      if (this.editOrder.items.length <= 1) {
        alert("Cannot delete the last item.");
        return;
      }

      this.editOrder.items = this.editOrder.items.filter(item => item.name !== name);
      this.editOrder.total = calculateTotal(this.editOrder.items);
    },

    addNewItemToEdit() {
      const itemName = prompt(
        "Enter item name:\n" +
          AVAILABLE_ITEMS.map((i) => `${i.name} - €${i.price}`).join("\n")
      );
      if (!itemName) return;

      const item = AVAILABLE_ITEMS.find((i) => i.name === itemName.split(' - ')[0]);
      if (!item) {
        alert("Item not found.");
        return;
      }

      const existing = this.editOrder.items.find((i) => i.name === item.name);
      if (existing) existing.quantity++;
      else this.editOrder.items.push({ ...item, quantity: 1 });

      this.editOrder.total = calculateTotal(this.editOrder.items);
    },

    async saveEdit() {
      try {
        // ✅ NOW USING REAL BACKEND API
        await orderService.updateOrder(this.editOrder.id, this.editOrder);
        
        const idx = this.orders.findIndex((o) => o.id === this.editOrder.id);
        this.orders[idx] = { ...this.editOrder };
        this.showEdit = false;
        this.filterOrders();
        alert(`Order ${this.editOrder.id} updated!`);
      } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import './orders-styles.css';

.customer-orders-page {
  min-height: 100vh;
  padding: 2rem 0;
  font-family: 'Poppins', sans-serif;
}

/* Accept Button */
.btn-accept {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-accept:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

/* View Details Button */
.btn-view-details {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view-details:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.order-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

/* Order Rating */
.order-rating {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fffbea;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.rating-label {
  font-weight: 600;
  color: #555;
}

.rating-value {
  color: #333;
  font-weight: 500;
}

.rating-stars {
  margin-left: 0.25rem;
  font-size: 1rem;
}

.rating-not-rated {
  color: #999;
  font-style: italic;
}
</style>
