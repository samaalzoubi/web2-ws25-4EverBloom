import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js";

/**
 * Generic GraphQL helper
 */
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_BASE, {
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
 * Fetch all orders (admin view) using GraphQL
 */
export async function fetchShopOwnerOrdersGraphQL(shopId) {
  const query = `
    query GetAllOrders($shopId: ID!) {
      ordersByShop(shopId: $shopId) {
        orderId
        customerId
        orderDate
        status
        totalAmount
        orderLines {
          quantity
          price
          bouquetName
        }
      }
    }
  `;

  const variables = { shopId: String(shopId) };

  const data = await graphqlRequest(query, variables);
  return data.ordersByShop;
}

/**
 * Fetch single order details using GraphQL
 */
export async function fetchOrderDetailsGraphQL(orderId) {
  const query = `
    query GetOrderDetails($orderId: ID!) {
      orderById(orderId: $orderId) {
        orderId
        customerId
        orderDate
        status
        totalAmount
        orderLines {
          quantity
          price
          bouquetName
        }
      }
    }
  `;

  const variables = { orderId: String(orderId) };

  const data = await graphqlRequest(query, variables);
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
