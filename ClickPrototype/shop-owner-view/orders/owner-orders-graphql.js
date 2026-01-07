import { GRAPHQL_ENDPOINT } from "/ClickPrototype/config/api.config.js";

/**
 * Generic GraphQL helper
 */
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP error: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  if (body.errors && body.errors.length) {
    const message = body.errors[0].message || "Unknown GraphQL error";
    throw new Error(message);
  }

  return body.data;
}

/**
 * Fetch all orders for a specific shop using GraphQL
 */
export async function fetchOrdersByShopGraphQL(shopId) {
  const query = `
    query GetShopOrders($shopId: Int!) {
      ordersByShop(shopId: $shopId) {
        orderId
        orderDate
        status
        totalAmount
        shippingAddress
        orderLines {
          quantity
          price
          bouquet {
            id
            name
            price
            imageUrl
          }
        }
        customer {
          id
          username
          email
        }
      }
    }
  `;

  const data = await graphqlRequest(query, { shopId: parseInt(shopId) });
  return data.ordersByShop;
}

/**
 * Fetch all orders (admin view) using GraphQL
 */
export async function fetchAllOrdersGraphQL() {
  const query = `
    query GetAllOrders {
      allOrders {
        orderId
        orderDate
        status
        totalAmount
        shippingAddress
        orderLines {
          quantity
          price
          bouquet {
            id
            name
            price
            imageUrl
          }
        }
        customer {
          id
          username
          email
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.allOrders;
}

/**
 * Fetch single order details using GraphQL
 */
export async function fetchOrderDetailsGraphQL(orderId) {
  const query = `
    query GetOrderDetails($orderId: Int!) {
      orderById(orderId: $orderId) {
        orderId
        orderDate
        status
        totalAmount
        shippingAddress
        orderLines {
          quantity
          price
          bouquet {
            id
            name
            price
            imageUrl
            description
          }
        }
        customer {
          id
          username
          email
        }
      }
    }
  `;

  const data = await graphqlRequest(query, { orderId: parseInt(orderId) });
  return data.orderById;
}

/**
 * Update order status using GraphQL mutation
 */
export async function updateOrderStatusGraphQL(orderId, status) {
  const mutation = `
    mutation UpdateOrderStatus($orderId: Int!, $status: String!) {
      updateOrderStatus(orderId: $orderId, status: $status) {
        orderId
        status
        orderDate
        totalAmount
      }
    }
  `;

  const variables = {
    orderId: parseInt(orderId),
    status: status
  };

  const data = await graphqlRequest(mutation, variables);
  return data.updateOrderStatus;
}

/**
 * Delete/Cancel order using GraphQL mutation
 */
export async function deleteOrderGraphQL(orderId) {
  const mutation = `
    mutation DeleteOrder($orderId: Int!) {
      deleteOrder(orderId: $orderId)
    }
  `;

  const variables = {
    orderId: parseInt(orderId)
  };

  const data = await graphqlRequest(mutation, variables);
  return data.deleteOrder;
}

/**
 * Get order statistics using GraphQL
 */
export async function fetchOrderStatsGraphQL(shopId = null) {
  const query = shopId ? `
    query GetShopStats($shopId: Int!) {
      shopOrderStats(shopId: $shopId) {
        totalOrders
        totalRevenue
        pendingOrders
        preparingOrders
        deliveredOrders
      }
    }
  ` : `
    query GetOverallStats {
      overallOrderStats {
        totalOrders
        totalRevenue
        pendingOrders
        preparingOrders
        deliveredOrders
      }
    }
  `;

  const variables = shopId ? { shopId: parseInt(shopId) } : {};
  const data = await graphqlRequest(query, variables);
  return shopId ? data.shopOrderStats : data.overallOrderStats;
}
