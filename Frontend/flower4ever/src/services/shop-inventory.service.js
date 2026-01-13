import { GRAPHQL_BASE } from "@/config/api.config.js";

export async function fetchShopStems(shopId) {
  const query = `
    query ($shopId: ID!) {
      shopStems(shopId: $shopId) {
        stemId
        flowerName
        flowerColor
        flowerSeason
        quantity
        price
        imageUrl
      }
    }
  `;
  const res = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { shopId } })
  });
  const json = await res.json();
  if (json.errors) throw json.errors;
  return json.data.shopStems;
}

export async function createShopStem(shopId, data) {
  const mutation = `
    mutation ($shopId: ID!, $request: CreateShopStemRequest!) {
      createShopStem(shopId: $shopId, request: $request) {
        stemId
      }
    }
  `;
  const res = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation, variables: { shopId, request: data } })
  });
  const json = await res.json();
  if (json.errors) throw json.errors;
}

export async function deleteShopStem(shopId, stemId) {
  const mutation = `
    mutation ($shopId: ID!, $stemId: ID!) {
      removeShopStem(shopId: $shopId, stemId: $stemId)
    }
  `;
  const res = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation, variables: { shopId, stemId } })
  });
  const json = await res.json();
  if (json.errors) throw json.errors;
}
