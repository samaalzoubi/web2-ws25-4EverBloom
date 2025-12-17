// orders_app.js - Modern Dynamic Version

let currentOrders = [...MOCK_ORDERS];
let searchTerm = "";
let selectedStatus = "all";
let showEdit = false;
let editOrder = null;

// Stats Calculation
const calculateStats = () => {
  const stats = {
    total: currentOrders.length,
    revenue: currentOrders.reduce((sum, order) => sum + order.total, 0),
    pending: currentOrders.filter(o => o.status === OrderStatus.PENDING).length,
    preparing: currentOrders.filter(o => o.status === OrderStatus.PREPARING).length,
    delivered: currentOrders.filter(o => o.status === OrderStatus.DELIVERED).length
  };
  return stats;
};

// Filters
const filterOrders = () => {
  let filtered = [...MOCK_ORDERS];
  if (searchTerm) {
    filtered = filtered.filter(
      (o) =>
        o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (selectedStatus !== "all") filtered = filtered.filter((o) => o.status === selectedStatus);
  currentOrders = filtered;
  renderApp();
};

const handleSearch = (e) => {
  searchTerm = e.target.value;
  filterOrders();
};

const handleFilter = (e) => {
  selectedStatus = e.target.value;
  filterOrders();
};

// Cancel Order - FIXED VERSION
const cancelOrder = (id) => {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) {
    showNotification("Order not found.", 'error');
    return;
  }
  
  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
    showNotification("This order cannot be modified.", 'error');
    return;
  }
  
  if (confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
    order.status = OrderStatus.CANCELLED;
    filterOrders();
    showNotification(`Order ${id} has been cancelled.`, 'success');
  }
};

// Accept Order - Changes status from PENDING to PREPARING or PREPARING to OUT_FOR_DELIVERY
const acceptOrder = (id) => {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) {
    showNotification("Order not found.", 'error');
    return;
  }
  
  let nextStatus, confirmMessage, successMessage;
  
  if (order.status === OrderStatus.PENDING) {
    nextStatus = OrderStatus.PREPARING;
    confirmMessage = "Are you sure you want to accept this order? It will move to Preparing status.";
    successMessage = `Order ${id} has been accepted and moved to Preparing status.`;
  } else if (order.status === OrderStatus.PREPARING) {
    nextStatus = OrderStatus.OUT_FOR_DELIVERY;
    confirmMessage = "Are you sure you want to send this order out for delivery?";
    successMessage = `Order ${id} has been sent out for delivery.`;
  } else {
    showNotification("Only pending or preparing orders can be accepted.", 'error');
    return;
  }
  
  if (confirm(confirmMessage)) {
    order.status = nextStatus;
    filterOrders();
    showNotification(successMessage, 'success');
  }
};

// Edit Order
const openEdit = (id) => {
  const o = MOCK_ORDERS.find((x) => x.id === id);
  if (!o) return;
  if (o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED)
    return showNotification("This order cannot be edited.", 'error');
  
  editOrder = JSON.parse(JSON.stringify(o));
  showEdit = true;
  renderApp();
};

const closeEdit = () => {
  showEdit = false;
  renderApp();
};

const updateQuantity = (name, delta) => {
  const item = editOrder.items.find((i) => i.name === name);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  editOrder.total = calculateTotal(editOrder.items);
  renderApp();
};

const deleteItem = (name) => {
  // Validation: Ensure at least one item remains
  if (editOrder.items.length <= 1) {
    showNotification("Cannot delete the last item. An order must have at least one item.", 'error');
    return;
  }
  
  editOrder.items = editOrder.items.filter(item => item.name !== name);
  editOrder.total = calculateTotal(editOrder.items);
  renderApp();
};

const addNewItemToEdit = () => {
  const itemName = prompt(
    "Enter item name to add:\n" +
      AVAILABLE_ITEMS.map((i) => `${i.name} - €${i.price}`).join("\n")
  );
  if (!itemName) return;
  
  const item = AVAILABLE_ITEMS.find((i) => i.name === itemName.split(' - ')[0]);
  if (!item) return showNotification("Item not found.", 'error');
  
  const existing = editOrder.items.find((i) => i.name === item.name);
  if (existing) existing.quantity++;
  else editOrder.items.push({ ...item, quantity: 1 });
  
  editOrder.total = calculateTotal(editOrder.items);
  renderApp();
};

const saveEdit = () => {
  const idx = MOCK_ORDERS.findIndex((o) => o.id === editOrder.id);
  MOCK_ORDERS[idx] = { ...editOrder };
  showEdit = false;
  filterOrders();
  showNotification(`Order ${editOrder.id} updated successfully!`, 'success');
};

// Chatbot functions removed - now using HTML-based chatbot with initChatbot()

// Notification System
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
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
};

// Render Functions
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
    <div class="stat-icon">👨‍🍳</div>
    <div class="stat-value">${stats.preparing}</div>
    <div class="stat-label">Preparing</div>
  </div>
</div>`;

const renderControls = () => `
<div class="controls-bar">
  <input class="search-input" placeholder="Search orders, customers..." value="${searchTerm}" />
  <select class="filter-select">
    <option value="all">All Statuses</option>
    ${getAllStatuses()
      .map((s) => `<option value="${s}" ${selectedStatus === s ? "selected" : ""}>${s}</option>`)
      .join("")}
  </select>
</div>`;

const renderOrderCard = (o) => `
<div class="order-card">
  <div class="order-header">
    <div>
      <div class="order-id">${o.id}</div>
      <div class="order-date">${formatDate(o.orderDate)}</div>
    </div>
    <span class="status-badge ${getStatusClass(o.status)}">${o.status}</span>
  </div>
  <div class="order-customer">${o.customer.name}</div>
  <div class="order-items">
    ${o.items.map(item => `
      <div class="order-item">
        <span>${item.name}</span>
        <span class="item-quantity">×${item.quantity}</span>
      </div>
    `).join('')}
  </div>
  <div class="order-total">${formatCurrency(o.total)}</div>
  <div class="order-actions">
    <button class="accept-btn ${o.status !== OrderStatus.PENDING && o.status !== OrderStatus.PREPARING ? 'hidden' : ''}" data-order-id="${o.id}">
      <i class="fas fa-check"></i>Accept
    </button>
    <button class="cancel-btn ${o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED ? 'hidden' : ''}" data-order-id="${o.id}">
      <i class="fas fa-times"></i>Cancel
    </button>
  </div>
</div>`;

const renderOrdersGrid = () => `
<div class="orders-grid">
  ${currentOrders.length > 0 
    ? currentOrders.map((o) => renderOrderCard(o)).join("")
    : '<div class="no-orders">No orders found matching your criteria.</div>'
  }
</div>`;

const renderEditModal = () => !showEdit ? "" : `
<div class="modal-overlay active">
  <div class="modal-content">
    <h2>Edit Order ${editOrder.id}</h2>
    ${editOrder.items
      .map(
        (i) => `
      <div class="edit-item">
        <span>${i.name} — ${formatCurrency(i.price)}</span>
        <div class="edit-item-controls">
          <button data-minus="${i.name}">-</button>
          <span>${i.quantity}</span>
          <button data-plus="${i.name}">+</button>
          ${editOrder.items.length > 1 ? `<button data-delete="${i.name}" class="delete-btn" title="Delete item"><i class="fas fa-trash"></i></button>` : ''}
        </div>
      </div>`
      )
      .join("")}
    <button id="add-item"><i class="fas fa-plus"></i> Add Item</button>
    <div class="edit-total">Total: ${formatCurrency(editOrder.total)}</div>
    <div class="modal-actions">
      <button id="save-edit" class="btn-save">Save Changes</button>
      <button id="close-edit" class="btn-close">Cancel</button>
    </div>
  </div>
</div>`;

// renderChatbot removed - chatbot now in HTML file

const renderApp = () => {
  const stats = calculateStats();
  const app = document.getElementById("app");
  app.innerHTML = `

    <main class="main-content">
      ${renderStats(stats)}
      ${renderControls()}
      ${renderOrdersGrid()}
    </main>
    ${renderEditModal()}
  `;

  // Event Listeners
  app.querySelector(".search-input")?.addEventListener("input", handleSearch);
  app.querySelector(".filter-select")?.addEventListener("change", handleFilter);

  // Accept buttons
  app.querySelectorAll(".accept-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const orderId = e.target.closest('.accept-btn').dataset.orderId;
      acceptOrder(orderId);
    });
  });

  // Cancel buttons - FIXED VERSION
  app.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const orderId = e.target.closest('.cancel-btn').dataset.orderId;
      cancelOrder(orderId);
    });
  });

  // Edit buttons
  app.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const orderId = e.target.closest('.edit-btn').dataset.orderId;
      openEdit(orderId);
    });
  });

  if (showEdit) {
    app.querySelectorAll("[data-minus]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        updateQuantity(e.target.closest('[data-minus]').dataset.minus, -1);
      })
    );
    app.querySelectorAll("[data-plus]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        updateQuantity(e.target.closest('[data-plus]').dataset.plus, 1);
      })
    );
    
    // Add delete button event listeners
    app.querySelectorAll("[data-delete]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const itemName = e.target.closest('[data-delete]').dataset.delete;
        deleteItem(itemName);
      })
    );

    // Use querySelector on the app container to find elements by id
    app.querySelector("#add-item")?.addEventListener("click", (e) => {
      e.preventDefault();
      addNewItemToEdit();
    });
    app.querySelector("#save-edit")?.addEventListener("click", (e) => {
      e.preventDefault();
      saveEdit();
    });
    app.querySelector("#close-edit")?.addEventListener("click", (e) => {
      e.preventDefault();
      closeEdit();
    });
  }

  // Initialize chatbot scroll
  if (chatbotOpen) scrollChatToBottom();
  // Accept pending button (moves one pending order -> preparing)
  app.querySelector("#accept-pending")?.addEventListener("click", (e) => {
    e.preventDefault();
    acceptPending();
  });
};

// Move the first pending order to preparing
const acceptPending = () => {
  const order = MOCK_ORDERS.find((o) => o.status === OrderStatus.PENDING);
  if (!order) {
    showNotification("No pending orders to accept.", 'info');
    return;
  }
  order.status = OrderStatus.PREPARING;
  filterOrders();
  showNotification(`Order ${order.id} accepted — now Preparing.`, 'success');
};

// // Chatbot functionality
// const initChatbot = () => {
//   const chatbot = document.getElementById('chatbot');
//   const chatbotToggle = document.querySelector('.chatbot-toggle');
//   const chatbotClose = document.querySelector('.chatbot-close');
//   const chatInput = document.querySelector('.chatbot-input input');
//   const sendButton = document.querySelector('.chatbot-input button');
  
//   if (!chatbot || !chatbotToggle || !chatbotClose || !chatInput || !sendButton) {
//     return; // Elements not found, exit gracefully
//   }
  
//   // Toggle chatbot
//   chatbotToggle.addEventListener('click', function() {
//     chatbot.classList.toggle('open');
//   });
  
//   // Close chatbot
//   chatbotClose.addEventListener('click', function() {
//     chatbot.classList.remove('open');
//   });
  
//   // Send message on Enter key
//   chatInput.addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//       sendChatMessage();
//     }
//   });
  
//   // Send message on button click
//   sendButton.addEventListener('click', sendChatMessage);
  
//   function sendChatMessage() {
//     const message = chatInput.value.trim();
//     if (message) {
//       // Add user message
//       const chatBody = document.querySelector('.chatbot-body');
//       const userMessage = document.createElement('div');
//       userMessage.className = 'chatbot-message user';
//       userMessage.textContent = message;
//       chatBody.appendChild(userMessage);
      
//       // Clear input
//       chatInput.value = '';
      
//       // Scroll to bottom
//       chatBody.scrollTop = chatBody.scrollHeight;
      
//       // Simulate bot response
//       setTimeout(() => {
//         const botMessage = document.createElement('div');
//         botMessage.className = 'chatbot-message bot';
//         botMessage.textContent = 'Thank you for your message! Our team will assist you shortly. 🌸';
//         chatBody.appendChild(botMessage);
//         chatBody.scrollTop = chatBody.scrollHeight;
//       }, 1000);
//     }
//   }
// };

// Startup
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
  initChatbot();
});

// Add some demo data manipulation for testing
window.demoAddOrder = () => {
  const sampleCustomers = ['Alex Thompson', 'Maria Garcia', 'James Wilson', 'Sophia Chen'];
  const sampleItems = AVAILABLE_ITEMS;
  
  const randomCustomer = {
    id: `CUST-DEMO-${Date.now()}`,
    name: sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)],
    email: "demo@example.com",
    phone: "+1 234 567 8999",
    address: "123 Demo Street"
  };
  
  const randomItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;
  
  const newOrder = {
    id: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-DEMO`,
    customer: randomCustomer,
    orderDate: new Date().toISOString(),
    items: [{ ...randomItem, quantity }],
    total: randomItem.price * quantity,
    status: OrderStatus.PENDING,
    notes: "Demo order"
  };
  
  MOCK_ORDERS.unshift(newOrder);
  filterOrders();
  showNotification(`Demo order ${newOrder.id} added!`, 'success');
};

/* i still need to make the cancel button fhnctional, need to add validation for the delete button, implement logic when item = 0 in edit mode it should be discarded */