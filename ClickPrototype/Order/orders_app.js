// orders_app.js - Modern Dynamic Version

let currentOrders = [...MOCK_ORDERS];
let searchTerm = "";
let selectedStatus = "all";
let showCreate = false;
let showEdit = false;
let editOrder = null;
let chatbotOpen = false;
let chatbotMessages = [
  { type: 'bot', text: CHATBOT_MESSAGES.greeting }
];

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

// Create Order
const handleCreateOrder = () => {
  showCreate = true;
  renderApp();
};

const closeCreate = () => {
  showCreate = false;
  renderApp();
};

const submitNewOrder = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const customer = {
    id: `CUST-${Date.now()}`,
    name: fd.get("customer"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    address: fd.get("address"),
  };
  const item = AVAILABLE_ITEMS.find((i) => i.name === fd.get("item"));
  const order = {
    id: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.random()).slice(2,5)}`,
    customer,
    orderDate: new Date().toISOString(),
    items: [{ ...item, quantity: parseInt(fd.get("quantity")) || 1 }],
    total: item.price * (parseInt(fd.get("quantity")) || 1),
    status: OrderStatus.PENDING,
    notes: fd.get("notes"),
  };
  MOCK_ORDERS.unshift(order);
  closeCreate();
  filterOrders();
  
  // Show success notification
  showNotification(`Order ${order.id} created successfully!`, 'success');
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

// Chatbot
const toggleChatbot = () => {
  chatbotOpen = !chatbotOpen;
  renderApp();
};

const closeChatbot = () => {
  chatbotOpen = false;
  renderApp();
};

const sendChatMessage = (text) => {
  if (!text.trim()) return;
  
  // Add user message
  chatbotMessages.push({ type: 'user', text });
  
  // Simulate bot response
  setTimeout(() => {
    let response = CHATBOT_MESSAGES.help;
    
    if (text.toLowerCase().includes('status')) {
      response = CHATBOT_MESSAGES.orderStatus;
    } else if (text.toLowerCase().includes('deliver')) {
      response = CHATBOT_MESSAGES.delivery;
    } else if (text.toLowerCase().includes('recommend') || text.toLowerCase().includes('suggest')) {
      response = CHATBOT_MESSAGES.recommendations;
    } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      response = "Hello! " + CHATBOT_MESSAGES.help;
    }
    
    chatbotMessages.push({ type: 'bot', text: response });
    renderApp();
    scrollChatToBottom();
  }, 1000);
  
  renderApp();
  scrollChatToBottom();
};

const scrollChatToBottom = () => {
  setTimeout(() => {
    const chatBody = document.querySelector('.chatbot-body');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, 100);
};

const handleChatInput = (e) => {
  if (e.key === 'Enter') {
    const input = e.target;
    sendChatMessage(input.value);
    input.value = '';
  }
};

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
    <div class="stat-value">${stats.total}</div>
    <div class="stat-label">Total Orders</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${formatCurrency(stats.revenue)}</div>
    <div class="stat-label">Total Revenue</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${stats.pending}</div>
    <div class="stat-label">Pending</div>
    ${stats.pending > 0 ? `<button id="accept-pending" class="btn-accept">Accept</button>` : `<button id="accept-pending" class="btn-accept" disabled>Accept</button>`}
  </div>
  <div class="stat-card">
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
  <button class="create-order-btn">
    <i class="fas fa-plus"></i>
    Create New Order
  </button>
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
    ${
      o.status === OrderStatus.OUT_FOR_DELIVERY
        ? `<button class="cancel-btn" data-order-id="${o.id}"><i class="fas fa-times"></i>Cancel</button>`
        : o.status === OrderStatus.PENDING || o.status === OrderStatus.PREPARING
        ? `<button class="edit-btn" data-order-id="${o.id}"><i class="fas fa-edit"></i>Edit</button>
           <button class="cancel-btn" data-order-id="${o.id}"><i class="fas fa-times"></i>Cancel</button>`
        : '<button disabled><i class="fas fa-lock"></i>Locked</button>'
    }
  </div>
</div>`;

const renderOrdersGrid = () => `
<div class="orders-grid">
  ${currentOrders.length > 0 
    ? currentOrders.map((o) => renderOrderCard(o)).join("")
    : '<div class="no-orders">No orders found matching your criteria.</div>'
  }
</div>`;

const renderCreateModal = () => !showCreate ? "" : `
<div class="modal-overlay active">
  <div class="modal-content">
    <h2>Create New Order</h2>
    <form id="create-form">
      <div class="form-group">
        <label>Customer Name</label>
        <input name="customer" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" name="phone" />
      </div>
      <div class="form-group">
        <label>Address</label>
        <textarea name="address" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Items</label>
        <select name="item">
          ${AVAILABLE_ITEMS.map((i) => `<option value="${i.name}">${i.name} - ${formatCurrency(i.price)}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Quantity</label>
        <input type="number" name="quantity" value="1" min="1" />
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes" rows="3"></textarea>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn-create">Create Order</button>
        <button type="button" class="btn-cancel" id="cancel-create">Cancel</button>
      </div>
    </form>
  </div>
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

const renderChatbot = () => `
<div id="chatbot" class="chatbot ${chatbotOpen ? 'open' : ''}">
  <div class="chatbot-header" onclick="toggleChatbot()">
    💬 BLÜMEO Assistant
    <span class="chatbot-close" onclick="event.stopPropagation(); closeChatbot();">✖</span>
  </div>
  <div class="chatbot-body">
    ${chatbotMessages.map(msg => `
      <div class="chatbot-message ${msg.type}">${msg.text}</div>
    `).join('')}
  </div>
  <div class="chatbot-input">
    <input type="text" placeholder="Type your message..." onkeypress="handleChatInput(event)" />
    <button onclick="sendChatMessage(this.previousElementSibling.value); this.previousElementSibling.value='';">
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
</div>`;

const renderApp = () => {
  const stats = calculateStats();
  const app = document.getElementById("app");
  app.innerHTML = `

    <main class="main-content">
      ${renderStats(stats)}
      ${renderControls()}
      ${renderOrdersGrid()}
    </main>
    ${renderCreateModal()}
    ${renderEditModal()}
    ${renderChatbot()}
    <button class="chatbot-toggle" onclick="toggleChatbot()" style="
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      width: 60px; 
      height: 60px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-dark) 100%); 
      color: white; 
      border: none; 
      cursor: pointer; 
      box-shadow: var(--shadow-hover);
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 1.5rem;
      z-index: 999;
    ">💬</button>
  `;

  // Event Listeners
  app.querySelector(".search-input")?.addEventListener("input", handleSearch);
  app.querySelector(".filter-select")?.addEventListener("change", handleFilter);
  app.querySelector(".create-order-btn")?.addEventListener("click", handleCreateOrder);

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

  if (showCreate) {
    app.querySelector("#create-form")?.addEventListener("submit", submitNewOrder);
    app.querySelector("#cancel-create")?.addEventListener("click", (e) => {
      e.preventDefault();
      closeCreate();
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

// Startup
document.addEventListener("DOMContentLoaded", renderApp);

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