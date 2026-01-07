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
 * Fetch all orders for a specific customer using GraphQL
 */
export async function fetchOrdersByCustomerGraphQL(customerId) {
  const query = `
    query GetCustomerOrders($customerId: Int!) {
      ordersByCustomer(customerId: $customerId) {
        orderId
        orderDate
        status
        totalAmount
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
      }
    }
  `;

  const data = await graphqlRequest(query, { customerId: parseInt(customerId) });
  return data.ordersByCustomer;
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
 * Submit a rating using GraphQL
 */
export async function submitRatingGraphQL(orderId, customerId, ratingScore, review = null) {
  const mutation = `
    mutation SubmitRating($input: RatingInput!) {
      submitRating(input: $input) {
        id
        ratingScore
        review
        order {
          orderId
        }
        customer {
          id
        }
      }
    }
  `;

  const variables = {
    input: {
      orderId: parseInt(orderId),
      customerId: parseInt(customerId),
      ratingScore: parseInt(ratingScore),
      review: review
    }
  };

  const data = await graphqlRequest(mutation, variables);
  return data.submitRating;
}

/**
 * Fetch ratings for a specific order using GraphQL
 */
export async function fetchOrderRatingsGraphQL(orderId) {
  const query = `
    query GetOrderRatings($orderId: Int!) {
      ratingsByOrder(orderId: $orderId) {
        id
        ratingScore
        review
        customer {
          id
          username
        }
      }
    }
  `;

  const data = await graphqlRequest(query, { orderId: parseInt(orderId) });
  return data.ratingsByOrder;
}
