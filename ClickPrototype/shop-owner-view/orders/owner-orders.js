import { API_MODE } from "/ClickPrototype/config/api.config.js";
import { 
  fetchOrdersForShopREST, 
  fetchOrderDetailsREST, 
  updateOrderStatusREST 
} from "./owner-orders-rest.js";
import { 
  fetchShopOwnerOrdersGraphQL, 
  fetchOrderDetailsGraphQL, 
  updateOrderStatusGraphQL 
} from "./owner-orders-graphql.js";
import { loadLayout } from '/ClickPrototype/layout/layout.js'

// Order Status Constants
const OrderStatus = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

// State Management
let currentOrders = [];
let searchTerm = "";
let selectedStatus = "all";
let showEdit = false;
let editOrder = null;
let userId = null

/**
 * Calculate order statistics
 */
const calculateStats = () => {
  const stats = {
    total: currentOrders.length,
    revenue: currentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    pending: currentOrders.filter(o => o.status === 'PENDING' || o.status === 'CREATED').length,
    preparing: currentOrders.filter(o => o.status === 'CONFIRMED').length,
    delivered: currentOrders.filter(o => o.status === 'DELIVERED').length
  };
  return stats;
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return `€${amount.toFixed(2)}`;
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Load orders based on API_MODE
 */
async function loadOrders() {
  try {
    console.log(`Fetching orders via ${API_MODE} API...`);
    
    const orders = API_MODE === "REST"
      ? await fetchOrdersForShopREST(userId)
      : await fetchShopOwnerOrdersGraphQL(userId);
    
    console.log('Orders fetched:', orders);
    currentOrders = orders;
    filterOrders();
  } catch (err) {
    console.error('Failed to load orders:', err);
    showNotification(`Failed to load orders: ${err.message}`, 'error');
  }
}

/**
 * Filter orders based on search and status
 */
const filterOrders = () => {
  let filtered = [...currentOrders];
  
  if (searchTerm) {
    filtered = filtered.filter(o => 
      o.orderId.toString().includes(searchTerm) ||
      (o.customer?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (selectedStatus !== "all") {
    filtered = filtered.filter(o => o.status === selectedStatus);
  }
  
  renderOrders(filtered);
};

/**
 * Search handler
 */
const handleSearch = (e) => {
  searchTerm = e.target.value;
  filterOrders();
};

/**
 * Filter handler
 */
const handleFilter = (e) => {
  selectedStatus = e.target.value;
  filterOrders();
};

/**
 * Update order status (Accept/Move to next stage)
 */
async function acceptOrder(orderId) {
  const order = currentOrders.find(o => o.orderId.toString() === orderId.toString());
  if (!order) {
    showNotification("Order not found.", 'error');
    return;
  }
  
  console.log('Order status:', order.status);
  
  let nextStatus, confirmMessage, successMessage;
  
  if (order.status === 'PENDING' || order.status === 'CREATED') {
    nextStatus = 'CONFIRMED';
    confirmMessage = "Accept this order and move to Confirmed?";
    successMessage = `Order #${orderId} accepted and moved to Confirmed.`;
  } else if (order.status === 'CONFIRMED') {
    nextStatus = 'IN_DELIVERY';
    confirmMessage = "Send this order out for delivery?";
    successMessage = `Order #${orderId} sent out for delivery.`;
  } else if (order.status === 'IN_DELIVERY') {
    nextStatus = 'DELIVERED';
    confirmMessage = "Mark this order as delivered?";
    successMessage = `Order #${orderId} has been delivered.`;
  } else {
    console.log('Cannot move forward from status:', order.status);
    showNotification("This order cannot be moved forward.", 'error');
    return;
  }
  
  if (!confirm(confirmMessage)) return;
  
  try {
    const updatedOrder = API_MODE === "REST"
      ? await updateOrderStatusREST(orderId, nextStatus)
      : await updateOrderStatusGraphQL(orderId, nextStatus);
    
    // Update local state
    const index = currentOrders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      currentOrders[index] = { ...currentOrders[index], status: nextStatus };
    }
    
    filterOrders();
    showNotification(successMessage, 'success');
  } catch (err) {
    console.error('Failed to update order status:', err);
    showNotification(`Failed to update order: ${err.message}`, 'error');
  }
}

/**
 * Cancel order
 */
async function cancelOrder(orderId) {
  const order = currentOrders.find(o => o.orderId.toString() === orderId.toString());
  if (!order) {
    showNotification("Order not found.", 'error');
    return;
  }
  
  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    showNotification("This order cannot be cancelled.", 'error');
    return;
  }
  
  if (!confirm("Are you sure you want to cancel this order?")) return;
  
  try {
    const updatedOrder = API_MODE === "REST"
      ? await updateOrderStatusREST(orderId, 'CANCELLED')
      : await updateOrderStatusGraphQL(orderId, 'CANCELLED');
    
    // Update local state
    const index = currentOrders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      currentOrders[index] = { ...currentOrders[index], status: 'CANCELLED' };
    }
    
    filterOrders();
    showNotification(`Order #${orderId} has been cancelled.`, 'success');
  } catch (err) {
    console.error('Failed to cancel order:', err);
    showNotification(`Failed to cancel order: ${err.message}`, 'error');
  }
}

/**
 * View order details
 */
async function viewOrderDetails(orderId) {
  try {
    const orderData = API_MODE === "REST"
      ? await fetchOrderDetailsREST(orderId)
      : await fetchOrderDetailsGraphQL(orderId);
    
    console.log('Order details:', orderData);
    
    let detailsText = `Order #${orderData.orderId}\n`;
    detailsText += `Customer: ${orderData.customer?.username || 'N/A'}\n`;
    detailsText += `Email: ${orderData.customer?.email || 'N/A'}\n`;
    detailsText += `Status: ${orderData.status}\n`;
    detailsText += `Date: ${formatDate(orderData.orderDate)}\n`;
    detailsText += `Total: €${orderData.totalAmount}\n`;
    detailsText += `\nItems:\n`;
    
    if (orderData.orderLines && orderData.orderLines.length > 0) {
      orderData.orderLines.forEach(line => {
        detailsText += `- ${line.bouquet.name} x${line.quantity} (€${line.price})\n`;
      });
    }
    
    alert(detailsText);
  } catch (err) {
    console.error('Failed to fetch order details:', err);
    showNotification(`Failed to load order details: ${err.message}`, 'error');
  }
}

/**
 * Show notification
 */
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
};

/**
 * Render statistics
 */
const renderStats = (stats) => `
  <div class="stats-overview">
    <div class="stat-card">
      <div class="stat-icon">📦</div>
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">Total Orders</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-value">${formatCurrency(stats.revenue)}</div>
      <div class="stat-label">Total Revenue</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">⏳</div>
      <div class="stat-value">${stats.pending}</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🔨</div>
      <div class="stat-value">${stats.preparing}</div>
      <div class="stat-label">Preparing</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-value">${stats.delivered}</div>
      <div class="stat-label">Delivered</div>
    </div>
  </div>
`;

/**
 * Render order card
 */
const renderOrderCard = (order) => {
  const statusClass = `status-${order.status.toLowerCase().replace(/ /g, '-')}`;
  const canAccept = order.status === 'CREATED' || order.status === 'CONFIRMED';
  const canCancel = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
  
  return `
    <div class="order-card ${statusClass}">
      <div class="order-header">
        <div>
          <div class="order-id">Order #${order.orderId}</div>
          <div class="order-customer">Customer #${order.customerId || ''}</div>
          <div class="order-date">${formatDate(order.orderDate)}</div>
        </div>
        <span class="status-badge">${order.status}</span>
      </div>
      
      <div class="order-items">
        ${order.orderLines && order.orderLines.length > 0
          ? order.orderLines.map(line => `
              <div class="order-item">
                <span>${line.bouquetName || 'Item'}</span>
                <span class="item-quantity">×${line.quantity}</span>
                <span class="item-price">${formatCurrency(line.price)}</span>
              </div>
            `).join('')
          : '<div class="order-item">No items</div>'
        }
      </div>
      
      <div class="order-total">Total: ${formatCurrency(order.totalAmount || 0)}</div>
      
      <div class="order-actions">
        <button class="btn btn-accept" onclick="window.acceptOrder(${order.orderId})">
          <i class="fas fa-check"></i> Accept
        </button>
        ${canCancel ? `
          <button class="btn btn-cancel" onclick="window.cancelOrder(${order.orderId})">
            <i class="fas fa-times"></i> Cancel
          </button>
        ` : ''}
      </div>
    </div>
  `;
};

/**
 * Render orders to DOM
 */
function renderOrders(orders) {
  const stats = calculateStats();
  const appContainer = document.getElementById('app');
  
  if (!appContainer) return;
  
  appContainer.innerHTML = `
    <main class="main-content">
      
      ${renderStats(stats)}
      
      <div class="controls-bar">
        <input 
          class="search-input" 
          placeholder="Search orders by ID, customer name, or email..." 
          value="${searchTerm}"
        />
        <select class="filter-select">
          <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>All Statuses</option>
          <option value="PENDING" ${selectedStatus === 'PENDING' ? 'selected' : ''}>Pending</option>
          <option value="CREATED" ${selectedStatus === 'CREATED' ? 'selected' : ''}>Created</option>
          <option value="CONFIRMED" ${selectedStatus === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
          <option value="IN_DELIVERY" ${selectedStatus === 'IN_DELIVERY' ? 'selected' : ''}>In Delivery</option>
          <option value="DELIVERED" ${selectedStatus === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
          <option value="CANCELLED" ${selectedStatus === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
      
      <div class="orders-grid">
        ${orders.length > 0 
          ? orders.map(renderOrderCard).join('') 
          : '<div class="no-orders">No orders found</div>'
        }
      </div>
    </main>
  `;
  
  // Add event listeners
  const searchInput = appContainer.querySelector('.search-input');
  const filterSelect = appContainer.querySelector('.filter-select');
  
  if (searchInput) searchInput.addEventListener('input', handleSearch);
  if (filterSelect) filterSelect.addEventListener('change', handleFilter);
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', async () => {
  userId = localStorage.getItem("userId");

  await loadLayout();
  loadOrders();
  
  // Expose functions globally for onclick handlers
  window.acceptOrder = acceptOrder;
  window.cancelOrder = cancelOrder;
  window.viewOrderDetails = viewOrderDetails;
});
