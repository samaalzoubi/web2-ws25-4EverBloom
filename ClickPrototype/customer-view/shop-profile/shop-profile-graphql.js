const GRAPHQL_URL = "http://localhost:8080/graphql";

/**
 * Fetch shop (owner) information via GraphQL
 */
export async function fetchShopByIdGraphQL(shopId) {
  const query = `
    query ($id: ID!) {
      userById(id: $id) {
        id
        role
        shopName
        description
        phoneNumber
        link
        logo
        address {
          streetAddress
          zipCode
          city
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { id: shopId }
    })
  });

  if (!response.ok) {
    throw new Error("GraphQL failed to fetch shop");
  }

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL returned errors");
  }
      return result.data.userById;
}

/**
 * Fetch bouquets for a shop via GraphQL
 */
export async function fetchShopBouquetsGraphQL(shopId) {
  const query = `
    query ($shopId: ID!) {
      bouquetsForShop(shopId: $shopId) {
        id
        name
        price
        imageUrl
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { shopId }
    })
  });

  if (!response.ok) {
    throw new Error("GraphQL failed to fetch bouquets");
  }

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL returned errors");
  }

  return result.data.bouquetsForShop;
}