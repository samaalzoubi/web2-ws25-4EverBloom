<template>
  <div class="admin-orders-page">
    <Header />
    <div class="orders-container">
      <div class="customer-header">
        <h1>Customer Orders Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      <!-- Stats Overview -->
      <div v-if="orders.length > 0" class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">{{ formatCurrency(stats.revenue) }}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ stats.delivered }}</div>
          <div class="stat-label">Delivered</div>
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
          <option value="Created">Created</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Delivery">In Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <!-- Orders Grid -->
      <div class="orders-grid">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
          :data-status="order.status"
        >
          <div class="order-header">
            <div>
              <div class="order-id">{{ order.id }}</div>
              <div class="order-date">{{ formatDate(order.orderDate) }}</div>
            </div>
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div v-for="item in order.items" :key="item.name" class="order-item">
              <span>{{ item.name }}</span>
              <span class="item-quantity">×{{ item.quantity }}</span>
            </div>
          </div>

          <div class="order-total">{{ formatCurrency(order.total) }}</div>

          <!-- Actions for different statuses -->
          <div class="customer-actions">
            <!-- Edit button for Created status -->
            <button
              v-if="order.status === 'Created'"
              class="btn-edit"
              @click="openEditModal(order)"
            >
              <i class="fas fa-pen"></i> Edit
            </button>

            <!-- Cancel button for non-delivered/cancelled orders -->
            <button
              v-if="canCancel(order)"
              class="cancel-btn"
              @click="cancelOrder(order.id)"
            >
              <i class="fas fa-times"></i> Cancel
            </button>

            <!-- Reorder button for delivered orders -->
            <button
              v-if="order.status === 'Delivered'"
              class="btn-reorder"
              @click="reorderItems(order)"
            >
              <i class="fas fa-redo"></i> Reorder
            </button>

            <button class="btn-help" @click="getHelp(order)">
              <i class="fas fa-question-circle"></i> Help
            </button>
          </div>

          <!-- Rating Box for Delivered Orders -->
          <div
            v-if="order.status === 'Delivered' && !order.rated"
            class="rating-box"
          >
            <h4>How was your experience?</h4>
            <div class="stars">
              <i
                v-for="star in 5"
                :key="star"
                class="fas fa-star"
                :class="{ active: star <= (order.hoverRating || order.selectedRating || 0) }"
                @mouseenter="order.hoverRating = star"
                @mouseleave="order.hoverRating = 0"
                @click="selectRating(order, star)"
              ></i>
            </div>
            <div
              v-if="order.selectedRating"
              class="rating-value-display"
            >
              Rating: <span class="current-rating">{{ order.selectedRating }}</span>/5
            </div>
            <div class="customer-actions">
              <button
                class="rating-submit-btn"
                :disabled="!order.selectedRating"
                @click="submitRating(order)"
              >
                Submit Rating
              </button>
            </div>
          </div>

          <!-- Thank you message -->
          <div v-if="order.rated" class="rating-thank-you">
            <i class="fas fa-check-circle"></i>
            <span>Thank you for your rating! We appreciate your feedback.</span>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit Order {{ editingOrder.id }}</h2>
            <button class="modal-close" @click="closeEditModal">×</button>
          </div>

          <div class="edit-modal-body">
            <div class="edit-items-list">
              <div
                v-for="(item, index) in editingOrder.items"
                :key="index"
                class="edit-item"
              >
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ formatCurrency(item.price) }}</span>
                </div>
                <div class="item-controls">
                  <button @click="decrementQuantity(index)">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="incrementQuantity(index)">
                    <i class="fas fa-plus"></i>
                  </button>
                  <button
                    v-if="editingOrder.items.length > 1"
                    class="btn-delete"
                    @click="deleteItem(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="add-item-btn" @click="showAddItemDialog">
              <i class="fas fa-plus"></i> Add Item
            </button>

            <div class="edit-total">
              Total: {{ formatCurrency(editingOrder.total) }}
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-save" @click="saveChanges">
              <i class="fas fa-check"></i> Save Changes
            </button>
            <button class="btn-cancel" @click="closeEditModal">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Chatbot -->
      <Chatbot />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue';
import Chatbot from './Chatbot.vue';
import orderService from '@/services/orderService';

const AVAILABLE_ITEMS = [
  { name: "Sunny Day Bouquet", price: 35.99 },
  { name: "Rose Garden Delight", price: 45.5 },
  { name: "Wildflower Wonder", price: 29.99 },
  { name: "Tulip Treasure", price: 42.0 },
  { name: "Orchid Oasis", price: 55.75 },
  { name: "Minimalist White", price: 38.0 },
];

export default {
  name: 'AdminOrders',
  components: { 
    Header,
    Chatbot 
  },
  data() {
    return {
      orders: [],
      filteredOrders: [],
      searchTerm: '',
      selectedStatus: 'all',
      showEditModal: false,
      editingOrder: null,
      loading: false,
      error: null
    };
  },
  computed: {
    stats() {
      return {
        total: this.orders.length,
        revenue: this.orders.reduce((sum, order) => sum + (order.total || 0), 0),
        pending: this.orders.filter(o => o.status === 'Created' || o.status === 'Confirmed').length,
        delivered: this.orders.filter(o => o.status === 'Delivered').length
      };
    }
  },
  async mounted() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        this.loading = true;
        this.error = null;
        // Use mock data until backend endpoint for all orders is ready
        this.orders = orderService.getMockOrders();
        this.filterOrders();
      } catch (err) {
        this.error = 'Failed to load orders';
        console.error('Error loading orders:', err);
      } finally {
        this.loading = false;
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount);
    },

    formatDate(date) {
      return new Date(date).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
    },

    getStatusClass(status) {
      const classes = {
        'Created': 'status-pending',
        'Confirmed': 'status-preparing',
        'In Delivery': 'status-out',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled',
        'Paid': 'status-delivered'
      };
      return classes[status] || '';
    },

    filterOrders() {
      let filtered = [...this.orders];

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(order =>
          order.id.toLowerCase().includes(term) ||
          order.items.some(item => item.name.toLowerCase().includes(term))
        );
      }

      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(order => order.status === this.selectedStatus);
      }

      this.filteredOrders = filtered;
    },

    canCancel(order) {
      return order.status !== 'Delivered' && order.status !== 'Cancelled';
    },

    async cancelOrder(orderId) {
      if (!confirm('Are you sure you want to cancel this order?')) return;

      try {
        await orderService.cancelOrder(orderId);
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'Cancelled';
          this.filterOrders();
          alert(`Order ${orderId} has been cancelled.`);
        }
      } catch (error) {
        alert('Failed to cancel order. Please try again.');
        console.error('Cancel order error:', error);
      }
    },

    openEditModal(order) {
      this.editingOrder = JSON.parse(JSON.stringify(order));
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editingOrder = null;
    },

    incrementQuantity(index) {
      this.editingOrder.items[index].quantity++;
      this.updateTotal();
    },

    decrementQuantity(index) {
      if (this.editingOrder.items[index].quantity > 1) {
        this.editingOrder.items[index].quantity--;
        this.updateTotal();
      }
    },

    deleteItem(index) {
      if (this.editingOrder.items.length <= 1) {
        alert('Cannot delete the last item.');
        return;
      }
      this.editingOrder.items.splice(index, 1);
      this.updateTotal();
    },

    showAddItemDialog() {
      const itemName = prompt(
        'Enter item name:\n' +
        AVAILABLE_ITEMS.map(i => `${i.name} - ${this.formatCurrency(i.price)}`).join('\n')
      );

      if (!itemName) return;

      const item = AVAILABLE_ITEMS.find(i => i.name === itemName.split(' - ')[0]);
      if (!item) {
        alert('Item not found.');
        return;
      }

      const existing = this.editingOrder.items.find(i => i.name === item.name);
      if (existing) {
        existing.quantity++;
      } else {
        this.editingOrder.items.push({ ...item, quantity: 1 });
      }

      this.updateTotal();
    },

    updateTotal() {
      this.editingOrder.total = this.editingOrder.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    async saveChanges() {
      try {
        // TODO: Implement updateOrder in backend
        await orderService.updateOrder(this.editingOrder.id, this.editingOrder);
        
        const index = this.orders.findIndex(o => o.id === this.editingOrder.id);
        if (index !== -1) {
          this.orders[index] = { ...this.editingOrder };
        }
        this.filterOrders();
        this.closeEditModal();
        alert(`Order ${this.editingOrder.id} updated successfully!`);
      } catch (error) {
        alert('Failed to update order. Please try again.');
        console.error('Update order error:', error);
      }
    },

    selectRating(order, rating) {
      order.selectedRating = rating;
      this.$forceUpdate();
    },

    async submitRating(order) {
      if (!order.selectedRating) {
        alert('Please select a rating.');
        return;
      }

      try {
        await orderService.submitRating(order.id, order.selectedRating);
        order.rated = true;
        this.$forceUpdate();
      } catch (error) {
        alert('Failed to submit rating. Please try again.');
        console.error('Submit rating error:', error);
      }
    },

    reorderItems(order) {
      alert('Reorder functionality: Items will be added to cart.');
    },

    getHelp(order) {
      alert(`Need help with order ${order.id}? Contact support.`);
    }
  }
};
</script>

<style scoped>
@import './orders-styles.css';

.admin-orders-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
  font-family: 'Poppins', sans-serif;
}

/* Rating Box */
.rating-box {
  background: linear-gradient(135deg, #f0e6f6 0%, rgba(212, 189, 240, 0.5) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 1.5rem;
}

.rating-box h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars i {
  font-size: 1.8rem;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.stars i.active {
  color: #ffc107;
}

.stars i:hover {
  transform: scale(1.2);
}

.rating-value-display {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7b68ad;
}

.rating-submit-btn {
  background: #7b68ad;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-top: 1rem;
}

.rating-submit-btn:hover:not(:disabled) {
  background: #6a5a9d;
  transform: translateY(-2px);
}

.rating-submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.rating-thank-you {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  text-align: center;
  color: #2e7d32;
}

.rating-thank-you i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0e6f6;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f0e6f6;
  color: #333;
}

.edit-modal-body {
  margin-bottom: 1.5rem;
}

.edit-items-list {
  margin-bottom: 1.5rem;
}

.add-item-btn {
  width: 100%;
  background: #f0e6f6;
  color: #7b68ad;
  border: 2px dashed #7b68ad;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.add-item-btn:hover {
  background: #7b68ad;
  color: white;
  border-style: solid;
}

.edit-total {
  text-align: right;
  font-size: 1.3rem;
  font-weight: 700;
  color: #7b68ad;
  padding: 1rem 0;
  border-top: 2px solid #f0e6f6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-save {
  background: #7b68ad;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save:hover {
  background: #6a5a9d;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.edit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #333;
}

.item-price {
  color: #666;
  font-size: 0.9rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #7b68ad;
  background: white;
  color: #7b68ad;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.item-controls button:hover {
  background: #7b68ad;
  color: white;
}

.btn-delete {
  background: #e57373 !important;
  border-color: #e57373 !important;
  color: white !important;
}

.btn-delete:hover {
  background: #d32f2f !important;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

/* Action Buttons */
.btn-edit {
  background: #7b68ad;
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

.btn-edit:hover {
  background: #6a5a9d;
  transform: translateY(-2px);
}

.cancel-btn {
  background: #e57373;
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

.cancel-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.btn-reorder {
  background: #4da6ff;
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

.btn-reorder:hover {
  background: #3d8ae6;
  transform: translateY(-2px);
}

.btn-help {
  background: #f0f0f0;
  color: #666;
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

.btn-help:hover {
  background: #e0e0e0;
}

.customer-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}
</style>
