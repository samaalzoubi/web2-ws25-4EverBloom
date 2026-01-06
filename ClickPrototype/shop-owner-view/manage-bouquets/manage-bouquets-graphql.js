const GRAPHQL_URL = "http://localhost:8080/graphql";

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

  const response = await fetch(GRAPHQL_URL, {
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
