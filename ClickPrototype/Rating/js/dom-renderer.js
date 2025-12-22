/**
 * DOM Rendering Module for Customer Orders and Ratings
 * Uses native DOM API to dynamically create and update UI elements
 */

/**
 * Render orders to the DOM
 */
export function renderOrders(orders, containerId = 'orders-container') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error('Orders container not found!');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    if (!orders || orders.length === 0) {
        renderEmptyState(container);
        return;
    }
    
    // Create and append order cards
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
}

/**
 * Create an order card element using DOM API
 */
function createOrderCard(order) {
    // Main card container
    const card = document.createElement('div');
    card.className = 'order-card';
    card.setAttribute('data-order-id', order.id);
    card.setAttribute('data-status', order.status || 'DELIVERED');
    
    // Order header
    const header = createOrderHeader(order);
    card.appendChild(header);
    
    // Order items
    if (order.orderLines && order.orderLines.length > 0) {
        const itemsContainer = createOrderItems(order.orderLines);
        card.appendChild(itemsContainer);
    }
    
    // Order total
    const total = createOrderTotal(order.totalPrice);
    card.appendChild(total);
    
    // Status badge
    const statusBadge = createStatusBadge(order.status || 'DELIVERED');
    card.appendChild(statusBadge);
    
    // Rating section
    const ratingSection = createRatingSection(order);
    card.appendChild(ratingSection);
    
    // Action buttons
    const actions = createOrderActions(order);
    card.appendChild(actions);
    
    return card;
}

/**
 * Create order header
 */
function createOrderHeader(order) {
    const header = document.createElement('div');
    header.className = 'order-header';
    
    const orderInfo = document.createElement('div');
    orderInfo.className = 'order-info';
    
    const orderId = document.createElement('h3');
    orderId.className = 'order-id';
    orderId.textContent = `Order #${order.id}`;
    
    const orderDate = document.createElement('span');
    orderDate.className = 'order-date';
    orderDate.innerHTML = `<i class="far fa-calendar"></i> ${formatDate(order.orderDate)}`;
    
    orderInfo.appendChild(orderId);
    orderInfo.appendChild(orderDate);
    header.appendChild(orderInfo);
    
    return header;
}

/**
 * Create order items list
 */
function createOrderItems(orderLines) {
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'order-items';
    
    const itemsList = document.createElement('ul');
    itemsList.className = 'items-list';
    
    orderLines.forEach(line => {
        const item = document.createElement('li');
        item.className = 'order-item';
        
        const itemName = document.createElement('span');
        itemName.className = 'item-name';
        itemName.textContent = line.itemName || 'Unknown Item';
        
        const itemQty = document.createElement('span');
        itemQty.className = 'item-quantity';
        itemQty.textContent = `x${line.quantity}`;
        
        const itemPrice = document.createElement('span');
        itemPrice.className = 'item-price';
        itemPrice.textContent = `€${(line.price * line.quantity).toFixed(2)}`;
        
        item.appendChild(itemName);
        item.appendChild(itemQty);
        item.appendChild(itemPrice);
        
        itemsList.appendChild(item);
    });
    
    itemsContainer.appendChild(itemsList);
    return itemsContainer;
}

/**
 * Create order total
 */
function createOrderTotal(totalPrice) {
    const totalContainer = document.createElement('div');
    totalContainer.className = 'order-total';
    
    const totalLabel = document.createElement('strong');
    totalLabel.textContent = 'Total: ';
    
    const totalAmount = document.createElement('span');
    totalAmount.className = 'total-amount';
    totalAmount.textContent = `€${(totalPrice || 0).toFixed(2)}`;
    
    totalContainer.appendChild(totalLabel);
    totalContainer.appendChild(totalAmount);
    
    return totalContainer;
}

/**
 * Create status badge
 */
function createStatusBadge(status) {
    const badge = document.createElement('span');
    badge.className = `status-badge status-${status.toLowerCase()}`;
    badge.textContent = status;
    
    return badge;
}

/**
 * Create rating section
 */
function createRatingSection(order) {
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';
    ratingContainer.setAttribute('data-order-id', order.id);
    
    const ratingTitle = document.createElement('p');
    ratingTitle.className = 'rating-title';
    ratingTitle.textContent = 'Rate this order:';
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    starsContainer.setAttribute('data-order-id', order.id);
    
    // Create 5 star elements
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.setAttribute('data-value', i);
        star.innerHTML = '★';
        star.addEventListener('click', () => handleStarClick(order.id, i));
        starsContainer.appendChild(star);
    }
    
    // Review textarea
    const reviewArea = document.createElement('textarea');
    reviewArea.className = 'rating-review';
    reviewArea.setAttribute('data-order-id', order.id);
    reviewArea.placeholder = 'Write your review (optional)...';
    reviewArea.rows = 3;
    
    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'rating-submit-btn';
    submitBtn.setAttribute('data-order-id', order.id);
    submitBtn.textContent = 'Submit Rating';
    submitBtn.addEventListener('click', () => handleRatingSubmit(order.id));
    
    // Check if order already has a rating
    if (order.rating && order.rating.score) {
        displayExistingRating(starsContainer, order.rating.score);
        reviewArea.value = order.rating.review || '';
        reviewArea.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Already Rated';
    }
    
    ratingContainer.appendChild(ratingTitle);
    ratingContainer.appendChild(starsContainer);
    ratingContainer.appendChild(reviewArea);
    ratingContainer.appendChild(submitBtn);
    
    return ratingContainer;
}

/**
 * Create order action buttons
 */
function createOrderActions(order) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'order-actions';
    
    // Reorder button
    const reorderBtn = document.createElement('button');
    reorderBtn.className = 'action-btn reorder-btn';
    reorderBtn.innerHTML = '<i class="fas fa-redo"></i> Reorder';
    reorderBtn.addEventListener('click', () => handleReorder(order.id));
    
    // View details button
    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.className = 'action-btn view-details-btn';
    viewDetailsBtn.innerHTML = '<i class="fas fa-info-circle"></i> Details';
    viewDetailsBtn.addEventListener('click', () => handleViewDetails(order.id));
    
    actionsContainer.appendChild(reorderBtn);
    actionsContainer.appendChild(viewDetailsBtn);
    
    return actionsContainer;
}

/**
 * Render empty state
 */
function renderEmptyState(container) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-shopping-bag';
    
    const message = document.createElement('p');
    message.textContent = 'No orders found.';
    
    emptyState.appendChild(icon);
    emptyState.appendChild(message);
    container.appendChild(emptyState);
}

/**
 * Display loading state
 */
export function showLoading(containerId = 'orders-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>';
    }
}

/**
 * Display error message
 */
export function showError(message, containerId = 'orders-container') {
    const container = document.getElementById(containerId);
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

/**
 * Helper: Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Helper: Display existing rating
 */
function displayExistingRating(starsContainer, score) {
    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < score) {
            star.classList.add('active');
        }
    });
}

/**
 * Event handler: Star click
 */
function handleStarClick(orderId, rating) {
    const starsContainer = document.querySelector(`.stars[data-order-id="${orderId}"]`);
    const stars = starsContainer.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Store selected rating
    starsContainer.setAttribute('data-selected-rating', rating);
}

/**
 * Event handler: Rating submit
 */
function handleRatingSubmit(orderId) {
    // This will be handled by the main app.js
    const event = new CustomEvent('rating-submit', { 
        detail: { orderId } 
    });
    document.dispatchEvent(event);
}

/**
 * Event handler: Reorder
 */
function handleReorder(orderId) {
    console.log('Reorder:', orderId);
    alert(`Reorder functionality for order ${orderId} - To be implemented`);
}

/**
 * Event handler: View details
 */
function handleViewDetails(orderId) {
    console.log('View details:', orderId);
    alert(`View details for order ${orderId} - To be implemented`);
}
