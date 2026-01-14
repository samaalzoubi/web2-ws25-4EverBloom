import { API_MODE } from "/ClickPrototype/config/api.config.js";
import { fetchOrdersByCustomerREST, fetchOrderDetailsREST, submitRatingREST, cancelOrderREST } from "./orders-rest.js";
import { fetchOrdersByCustomerGraphQL, submitRatingGraphQL } from "./orders-graphql.js";
import { loadLayout } from "/ClickPrototype/layout/layout.js";

let userId = null;
let selectedStatus = 'all';
let editingOrder = null;

/**
 * Rating System with localStorage persistence
 */
class RatingSystem {
  constructor() {
    this.ratings = this.loadRatings();
    this.customerId = this.resolveCustomerId();
    this.initializeRatings();
  }

  loadRatings() {
    const stored = localStorage.getItem('orderRatings');
    return stored ? JSON.parse(stored) : {};
  }

  saveRatings() {
    localStorage.setItem('orderRatings', JSON.stringify(this.ratings));
  }

  resolveCustomerId() {
    const id = localStorage.getItem("userId")
    return id ? Number(id) : null;
  }

  initializeRatings() {
    const starContainers = document.querySelectorAll('.stars');

    starContainers.forEach(container => {
      const orderId = container.dataset.orderId;
      const stars = container.querySelectorAll('i');

      if (this.ratings[orderId]) {
        this.displayRating(orderId, this.ratings[orderId]);
      }

      stars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
          e.preventDefault();
          this.setRating(orderId, index + 1);
        });

        star.addEventListener('mouseover', () => {
          stars.forEach((s, i) => {
            if (i < index + 1) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        });
      });

      container.addEventListener('mouseleave', () => {
        if (this.ratings[orderId]) {
          this.displayRating(orderId, this.ratings[orderId]);
        } else {
          stars.forEach(s => s.classList.remove('active'));
        }
      });
    });

    const submitButtons = document.querySelectorAll('.rating-submit-btn');
    submitButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitRating(btn);
      });
    });
  }

  setRating(orderId, value) {
    this.ratings[orderId] = value;
    this.displayRating(orderId, value);
  }

  displayRating(orderId, value) {
    const container = document.querySelector(`.stars[data-order-id="${orderId}"]`);
    if (!container) return;
    const stars = container.querySelectorAll('i');
    const displayElement = document.getElementById(`rating-display-${orderId}`);

    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });

    if (displayElement) {
      displayElement.style.display = 'block';
      displayElement.querySelector('.current-rating').textContent = value;
    }
  }

  async submitRating(button) {
    const orderId = button.dataset.orderId;
    const rating = this.ratings[orderId];

    if (!rating) {
      alert('Please select a rating before submitting.');
      return;
    }

    if (!this.customerId) {
      alert('Missing customer information. Please reload the page.');
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Submitting...';

    try {
      // Use appropriate API based on API_MODE
      const result = API_MODE === "REST"
        ? await submitRatingREST(orderId, this.customerId, rating, null)
        : await submitRatingGraphQL(orderId, this.customerId, rating, null);

      this.saveRatings();

      const thankYouElement = document.getElementById(`thank-you-${orderId}`);
      if (thankYouElement) {
        thankYouElement.style.display = 'block';
      }

      button.style.display = 'none';
      console.log(`Rating submitted for order ${orderId}: ${rating}/5 stars`, result);
    } catch (err) {
      console.error('Failed to submit rating', err);
      button.disabled = false;
      button.textContent = originalText;

      // Check if it's a duplicate rating error
      if (err.message.includes('already rated')) {
        alert('A rating has already been submitted');
      } else {
        alert(`Failed to submit rating: ${err.message || 'Please try again.'}`);
      }
    }
  }
}

/**
 * Render orders to the DOM (Client-Side Rendering)
 */
function renderOrders(orders) {
  const ordersGrid = document.getElementById('orders-grid');
  if (!ordersGrid) return;

  if (!orders || orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">No orders yet</div>
            <div class="order-date">Place an order to leave a rating.</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  ordersGrid.innerHTML = '';

  orders.forEach(order => {
    // Check for local temporary updates
    const localOrdersKey = `tempOrder_${order.orderId}`;
    const tempData = localStorage.getItem(localOrdersKey);
    
    if (tempData) {
      try {
        const parsed = JSON.parse(tempData);
        // Apply temporary local updates to order
        order.orderLines = parsed.items.map(item => ({
          bouquetName: item.name,
          quantity: item.quantity,
          price: item.price,
          bouquet: {
            bouquetId: item.bouquetId,
            name: item.name
          }
        }));
        order.totalAmount = parsed.totalAmount;
      } catch (e) {
        console.error('Error parsing temp order data:', e);
      }
    }
    
    const orderCard = createOrderCard(order);
    ordersGrid.appendChild(orderCard);
  });

  // Initialize rating system after rendering
  new RatingSystem();
}

/**
 * Create order card DOM element
 */
function createOrderCard(order) {
  const card = document.createElement('div');
  card.className = 'order-card';
  card.setAttribute('data-status', order.status);

  const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  // Map status to CSS class for styling
  const statusClass = {
    'PENDING': 'status-pending',
    'CREATED': 'status-pending',
    'CONFIRMED': 'status-confirmed',
    'IN_DELIVERY': 'status-out',
    'DELIVERED': 'status-delivered',
    'CANCELLED': 'status-cancelled',
    'PAID': 'status-paid'
  }[order.status] || 'status-pending';

  card.innerHTML = `
    <div class="order-header">
      <div>
        <div class="order-id">Order #${order.orderId}</div>
        <div class="order-date">${orderDate}</div>
      </div>
      <span class="status-badge ${statusClass}">${order.status.replace(/_/g, ' ')}</span>
    </div>

    <div class="order-items">
      ${order.orderLines && order.orderLines.length > 0
        ? order.orderLines.map(line => `
            <div class="order-item">
              <span>${line.bouquetName || 'Item'}</span>
              <span class="item-quantity">×${line.quantity}</span>
            </div>
          `).join('')
        : '<div class="order-item">No items</div>'
      }
    </div>

    <div class="order-total">€${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</div>

    ${(order.status === 'CREATED' || order.status === 'CONFIRMED') ? `
    <div class="order-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: center;">
      <button class="edit-btn" data-order-id="${order.orderId}" style="padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
        <i class="fas fa-edit"></i> Edit Order
      </button>
      <button class="cancel-btn" data-order-id="${order.orderId}" style="padding: 0.5rem 1rem; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
        <i class="fas fa-times"></i> Cancel Order
      </button>
    </div>
    ` : ''}

    ${order.status === 'DELIVERED' && !order.rating ? `
    <div class="rating-box">
      <h4>How was your experience?</h4>
      <div class="stars" data-order-id="${order.orderId}">
        <i class="fa-solid fa-star" data-value="1"></i>
        <i class="fa-solid fa-star" data-value="2"></i>
        <i class="fa-solid fa-star" data-value="3"></i>
        <i class="fa-solid fa-star" data-value="4"></i>
        <i class="fa-solid fa-star" data-value="5"></i>
      </div>
      <div class="rating-value-display" id="rating-display-${order.orderId}" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--brand-primary); display: none;">
        Rating: <span class="current-rating">0</span>/5
      </div>

      <div class="customer-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
        <button class="rating-submit-btn" type="button" data-order-id="${order.orderId}">
          Submit Rating
        </button>
      </div>

      <div class="rating-thank-you" id="thank-you-${order.orderId}" style="display: none; margin-top: 1rem; padding: 1rem; background: #e8f5e9; border-radius: 8px; text-align: center; color: #2e7d32;">
        <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
        <span>Thank you for your rating! We appreciate your feedback!</span>
      </div>
    </div>
    ` : ''}
    
    ${order.status === 'DELIVERED' && order.rating ? `
    <div class="rating-thank-you" style="margin-top: 1rem; padding: 1rem; background: #e8f5e9; border-radius: 8px; text-align: center; color: #2e7d32;">
      <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
      <span>Thank you for your rating! We appreciate your feedback!</span>
    </div>
    ` : ''}
  `;

  return card;
}

/**
 * View order details handler
 */
async function viewOrderDetails(orderId) {
  try {
    const orderData = API_MODE === "REST"
      ? await fetchOrderDetailsREST(orderId)
      : await fetchOrderDetailsGraphQL(orderId);

    console.log('Order details:', orderData);

    let detailsText = `Order #${orderData.orderId}\n`;
    detailsText += `Status: ${orderData.status}\n`;
    detailsText += `Date: ${orderData.orderDate}\n`;
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
    alert(`Failed to load order details: ${err.message}`);
  }
}

/**
 * Load orders based on API_MODE
 */
async function loadOrders(userId) {
  if (!userId) {
    console.error('No customer ID found');
    return;
  }

  try {
    console.log(`Fetching orders via ${API_MODE} API...`);

    const orders = API_MODE === "REST"
      ? await fetchOrdersByCustomerREST(userId)
      : await fetchOrdersByCustomerGraphQL(userId);

    console.log('Orders fetched:', orders);
    renderOrders(orders);
  } catch (err) {
    console.error('Failed to load orders:', err);
    alert(`Failed to load orders: ${err.message}`);
  }
}

/**
 * Initialize page
 */
document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  userId = localStorage.getItem("userId");

  if (isLoggedIn !== "true" || role !== "CUSTOMER") {
    window.location.href = "/ClickPrototype/common-view/login/login.html";
    return;
  }

  await loadLayout();

  loadOrders(userId);

  const filterSelect = document.querySelector(".filter-select");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
      selectedStatus = e.target.value;
      filterOrders();
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-details-btn");
    if (!btn) return;

    const orderId = btn.getAttribute("data-order-id");
    if (orderId) viewOrderDetails(orderId);
  });

  // Modal event listeners
  const closeEditModalBtn = document.getElementById('close-edit-modal');
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }

  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', closeEditModal);
  }

  const saveEditBtn = document.getElementById('save-edit-btn');
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', saveEditedOrder);
  }

  const editModal = document.getElementById('edit-modal');
  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) {
        closeEditModal();
      }
    });
  }

  // Edit order button handler
  document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (!editBtn) return;

    const orderId = editBtn.getAttribute("data-order-id");
    if (orderId) {
      openEditModal(orderId);
    }
  });

  // Cancel order button handler
  document.addEventListener("click", (e) => {
    const cancelBtn = e.target.closest(".cancel-btn");
    if (!cancelBtn) return;

    const orderId = cancelBtn.getAttribute("data-order-id");
    if (orderId) {
      if (confirm(`Are you sure you want to cancel order #${orderId}?`)) {
        cancelOrder(orderId);
      }
    }
  });
});

/**
 * Open edit modal
 */
async function openEditModal(orderId) {
  const editModal = document.getElementById('edit-modal');
  const modalTitle = document.getElementById('modal-title');
  const editModalBody = document.getElementById('edit-modal-body');
  
  if (!editModal || !modalTitle || !editModalBody) {
    alert('Edit modal not found');
    return;
  }
  
  try {
    // Check for local temporary updates first
    const localOrdersKey = `tempOrder_${orderId}`;
    const tempData = localStorage.getItem(localOrdersKey);
    
    if (tempData) {
      // Use local data if available
      const parsed = JSON.parse(tempData);
      editingOrder = {
        orderId: orderId,
        items: parsed.items
      };
      console.log('Using local updated order data:', editingOrder);
    } else {
      // Fetch from backend if no local updates
      const orderData = await fetchOrderDetailsREST(orderId);
      
      editingOrder = {
        orderId: orderData.orderId,
        items: orderData.orderLines.map(line => ({
          bouquetId: line.bouquet?.bouquetId || line.bouquetId,
          name: line.bouquet?.name || line.bouquetName || 'Unknown Item',
          price: line.price || 0,
          quantity: line.quantity || 1
        }))
      };
      
      console.log('Editing order prepared from backend:', editingOrder);
    }
    
    modalTitle.textContent = `Edit Order #${orderId}`;
    renderEditModalContent();
    editModal.style.display = 'flex';
  } catch (err) {
    console.error('Failed to load order:', err);
    alert(`Failed to load order: ${err.message}`);
  }
}

/**
 * Render edit modal content
 */
function renderEditModalContent() {
  const editModalBody = document.getElementById('edit-modal-body');
  if (!editModalBody || !editingOrder) return;
  
  const currentTotal = calculateTotal(editingOrder.items);
  
  let html = '<div class="edit-items-list">';
  
  editingOrder.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    html += `
      <div class="edit-item">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-price">€${item.price.toFixed(2)} × ${item.quantity} = €${itemTotal.toFixed(2)}</span>
        </div>
        <div class="item-controls">
          <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
          ${editingOrder.items.length > 1 ? `<button class="delete-btn" data-action="delete" data-index="${index}" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  html += `
    <button class="add-item-btn" id="add-new-item-btn" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; background: var(--brand-secondary); color: var(--text-dark); border: 2px dashed var(--brand-primary); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem;">
      <i class="fas fa-plus"></i> Add New Item
    </button>
  `;
  html += `<div class="edit-total">Total: €${currentTotal.toFixed(2)}</div>`;
  
  editModalBody.innerHTML = html;
  
  const addItemBtn = document.getElementById('add-new-item-btn');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', showAddItemPrompt);
  }
  
  editModalBody.querySelectorAll('.qty-btn, .delete-btn').forEach(btn => {
    btn.addEventListener('click', handleModalButtonClick);
  });
}

/**
 * Calculate total
 */
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Handle modal button clicks
 */
function handleModalButtonClick(e) {
  e.preventDefault();
  const action = e.currentTarget.dataset.action;
  const index = parseInt(e.currentTarget.dataset.index);
  
  if (!editingOrder || !editingOrder.items[index]) return;
  
  switch (action) {
    case 'increase':
      editingOrder.items[index].quantity++;
      renderEditModalContent();
      break;
    case 'decrease':
      if (editingOrder.items[index].quantity > 1) {
        editingOrder.items[index].quantity--;
        renderEditModalContent();
      }
      break;
    case 'delete':
      if (editingOrder.items.length > 1) {
        editingOrder.items.splice(index, 1);
        renderEditModalContent();
      } else {
        alert('Cannot delete the last item');
      }
      break;
  }
}

/**
 * Close edit modal
 */
function closeEditModal() {
  const editModal = document.getElementById('edit-modal');
  if (editModal) {
    editModal.style.display = 'none';
  }
  editingOrder = null;
}

/**
 * Show prompt to add new item
 */
function showAddItemPrompt() {
  if (!editingOrder) return;
  
  const itemName = prompt('Enter item name:');
  if (!itemName || itemName.trim() === '') return;
  
  const itemPrice = prompt('Enter item price (€):');
  if (!itemPrice || isNaN(parseFloat(itemPrice))) {
    alert('Invalid price');
    return;
  }
  
  // Add the new item to the order
  editingOrder.items.push({
    bouquetId: Date.now(), // Temporary ID
    name: itemName.trim(),
    price: parseFloat(itemPrice),
    quantity: 1
  });
  
  // Re-render the modal
  renderEditModalContent();
}

/**
 * Save edited order
 */
async function saveEditedOrder() {
  if (!editingOrder) return;
  
  try {
    // Save data before closing modal
    const orderId = editingOrder.orderId;
    const items = [...editingOrder.items]; // Create a copy
    const totalAmount = calculateTotal(items);
    
    // Store changes locally for immediate UI update
    const localOrdersKey = `tempOrder_${orderId}`;
    localStorage.setItem(localOrdersKey, JSON.stringify({
      items: items,
      totalAmount: totalAmount,
      timestamp: Date.now()
    }));
    
    console.log('Order saved locally:', { orderId, items, totalAmount });
    
    closeEditModal();
    
    alert(`✓ Order #${orderId} changes saved successfully!\n\nUpdated Items: ${items.length}\nNew Total: €${totalAmount.toFixed(2)}`);
    
    await loadOrders(userId);
  } catch (err) {
    console.error('Failed to save order:', err);
    alert(`Failed to save order: ${err.message}`);
  }
}

/**
 * Cancel an order
 */
async function cancelOrder(orderId) {
  try {
    await cancelOrderREST(orderId);
    alert(`Order #${orderId} has been cancelled successfully.`);
    await loadOrders(userId);
  } catch (err) {
    console.error('Failed to cancel order:', err);
    alert(`Failed to cancel order: ${err.message}`);
  }
}


/**
 * Filter orders by status
 */
function filterOrders() {
  const ordersGrid = document.getElementById('orders-grid');
  const orderCards = ordersGrid.querySelectorAll('.order-card');

  orderCards.forEach(card => {
    const cardStatus = card.getAttribute('data-status'); // e.g., "CREATED", "IN_DELIVERY"
    
    // Normalize both statuses for comparison
    const normalizedCardStatus = cardStatus.replace(/_/g, ' '); // "IN_DELIVERY" -> "IN DELIVERY"
    const normalizedSelectedStatus = selectedStatus.toUpperCase(); // "Created" -> "CREATED"

    if (selectedStatus === 'all' || 
        cardStatus === normalizedSelectedStatus || 
        normalizedCardStatus === normalizedSelectedStatus ||
        cardStatus.toUpperCase() === normalizedSelectedStatus) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  console.log(`Filtered orders by status: ${selectedStatus}`);
}
