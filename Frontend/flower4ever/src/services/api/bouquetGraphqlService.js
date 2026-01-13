import { GRAPHQL_BASE } from "@/config/api.config.js";

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

  const response = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { shopId } })
  });

  const result = await response.json();
  if (result.errors) throw new Error("GraphQL returned errors");
  return result.data.bouquetsForShop;
}

export async function createPremadeBouquet(shopId, data) {
  const mutation = `
    mutation CreatePremadeBouquet($shopId: ID!, $request: CreatePremadeBouquetRequest!) {
      createPremadeBouquet(shopId: $shopId, request: $request) {
        id
        name
        description
        imageUrl
        price
      }
    }
  `;
  const variables = {
    shopId: Number(shopId),
    request: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      fixedPrice: data.fixedPrice,
      occasions: data.occasions || []
    }
  };
  const result = await graphqlRequest(mutation, variables);
  return result.createPremadeBouquet;
}
