import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js"

export async function fetchBouquetsGraphQL(shopId) {
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

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL error");
  }

  return result.data.bouquetsForShop;
}

export async function createPremadeBouquet(shopId, data) {
  const CREATE_PREMADE_BOUQUET_MUTATION = `
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

  const response = await fetch( GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: CREATE_PREMADE_BOUQUET_MUTATION,
      variables: {
        shopId: Number(shopId),
        request: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          fixedPrice: data.fixedPrice,
          occasions: data.occasions || []
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP error: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  if (body.errors && body.errors.length) {
    const message = body.errors[0].message || "Unknown GraphQL error";
    throw new Error(message);
  }

  return body.data.createPremadeBouquet;
}
