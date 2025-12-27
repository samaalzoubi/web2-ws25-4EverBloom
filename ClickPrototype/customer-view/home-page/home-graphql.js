import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js";

//Generic GraphQL helper
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
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

//GET /bouquet/premade/latest
export async function fetchFlowersGraphQL() {
  const query = `
    query {
      latestPremadeBouquetsPerShop {
        shopId
        shopLogo
        bouquets {
          id
          name
          price
          imageUrl
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.latestPremadeBouquetsPerShop;
}

//POST /cart/{userId}/items?bouquetId=...
export async function addToCartGraphQL(userId, bouquetId) {
  const mutation = `
    mutation AddItem($userId: ID!, $bouquetId: ID!) {
      addItem(userId: $userId, bouquetId: $bouquetId) {
        totalQuantity
        totalPrice
        items {
          itemId
          bouquetId
          bouquetName
          quantity
          unitPrice
          imageUrl
        }
      }
    }
  `;

  const data = await graphqlRequest(mutation, { userId, bouquetId });
  return data.addItem;
}

//GET /cart/{userId}
export async function getActiveCartGraphQL(userId) {
    const query = `
        query ActiveCart($userId: ID!) {
            activeCart(userId: $userId) {
                totalQuantity
                totalPrice
                items {
                    itemId
                    bouquetId
                    bouquetName
                    quantity
                    unitPrice
                    imageUrl
                }
            }
        }`;
                
    const data = await graphqlRequest(query, { userId });
    
    return data.activeCart;
}

//PATCH /cart/{userId}/items/{itemId}?quantityDelta=...
export async function patchCartItemQuantityGraphQL(userId, itemId, quantityDelta) {
  const mutation = `
    mutation UpdateQuantity($userId: ID!, $itemId: ID!, $delta: Int!) {
      updateItemQuantity(userId: $userId, itemId: $itemId, quantityDelta: $delta) {
        totalQuantity
        totalPrice
        items {
          itemId
          bouquetId
          bouquetName
          quantity
          unitPrice
          imageUrl
        }
      }
    }
  `;

  const variables = { userId, itemId, delta: quantityDelta };
  const data = await graphqlRequest(mutation, variables);
  return data.updateItemQuantity;
}

//DELETE /cart/{userId}
export async function clearCartGraphQL(userId) {
  const mutation = `
    mutation ClearCart($userId: ID!) {
      clearCart(userId: $userId) {
        totalQuantity
        totalPrice
        items {
            itemId
            bouquetId
            bouquetName
            quantity
            unitPrice
            imageUrl
        }
    }
}`;

  const data = await graphqlRequest(mutation, { userId });
  return data.clearCart === true;
}

//GET /users/owners
export async function fetchShopsGraphQL() {
  const query = `
    query {
      allOwners {
        id
        username
        shopName
        logo
        link
        phoneNumber
        description
        flowerShopType
        latitude
        longitude
        address {
          streetAddress
          zipCode
          city
          state
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.allOwners;
}
