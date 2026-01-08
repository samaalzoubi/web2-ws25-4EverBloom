import { loadLayout } from '/ClickPrototype/layout/layout.js'
import { REST_BASE } from '/ClickPrototype/config/api.config.js'

const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";

document.addEventListener("DOMContentLoaded", async () => {
  const cachedCartState = sessionStorage.getItem("cartState");
  const cartState = JSON.parse(cachedCartState);
  const placeOrderButton = document.querySelector(".buttonOrder")

  await loadLayout();

  renderCheckoutCart(cartState);
  renderTotals(cartState);

  placeOrderButton.addEventListener("click", async () => {
    await handlePlaceOrder(cartState);
  });
});

async function handlePlaceOrder(cartState) {
  // Get form data
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zipCode = document.getElementById('zipCode').value;

  // Validate form
  if (!street || !city || !state || !zipCode) {
    alert('Please fill in all delivery information fields');
    return;
  }

  // Get user ID from localStorage (stored during login)
  const userId = localStorage.getItem('userId');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (!isLoggedIn || !userId) {
    alert('Please log in to place an order');
    window.location.href = '/ClickPrototype/common-view/login/login.html';
    return;
  }

  // Check if cart has items
  if (!cartState || !cartState.items || cartState.items.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // Prepare order data
  const bouquetIds = cartState.items.map(item => item.bouquetId);
  const quantities = cartState.items.map(item => item.quantity);
  
  const orderData = {
    bouquetIds: bouquetIds,
    quantities: quantities,
    address: {
      street: street,
      city: city,
      state: state,
      zipCode: zipCode,
      country: "Germany"
    }
  };

  console.log('Creating order with data:', orderData);

  try {
    // Show loading state
    const button = document.querySelector('.buttonOrder');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Processing...';

    // Send order to backend
    const response = await fetch(`${REST_BASE}/orders/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create order: ${response.status}`);
    }

    const createdOrder = await response.json();
    console.log('Order created successfully:', createdOrder);

    // Clear cart
    sessionStorage.removeItem('cartState');

    // Show success message
    alert(`Thank you for your order! Order ID: ${createdOrder.id || 'N/A'}`);

    // Redirect to orders page
    window.location.href = "/ClickPrototype/customer-view/orders/customer_orders.html";

  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order: ' + error.message);
    
    // Reset button state
    const button = document.querySelector('.buttonOrder');
    button.disabled = false;
    button.textContent = 'Place Order';
  }
}

function renderCheckoutCart(cartState) {
  const listEl = document.querySelector(".returnCart .list");
  listEl.innerHTML = "";

  const items = cartState?.items;

  items.forEach(item => {
    const imageUrl = item.imageUrl || DEFAULT_BOUQUET_IMAGE;

    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <img src="${imageUrl}" alt="${item.bouquetName}">
      <div class="info">
        <div class="name">${item.bouquetName}</div>
        <div class="price">${formatPriceEUR(item.unitPrice)} / bouquet</div>
      </div>
      <div class="quantity">${item.quantity}</div>
    `;

    listEl.appendChild(el);
  });
}

function renderTotals(cartState) {
  const quantityEl = document.querySelector(".totalQuantity");
  const priceEl = document.querySelector(".totalPrice");

  quantityEl.textContent = cartState.totalQuantity ?? 0;
  priceEl.textContent = formatPriceEUR(cartState.totalPrice ?? 0);
}

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}
