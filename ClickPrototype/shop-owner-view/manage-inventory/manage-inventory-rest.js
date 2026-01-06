const BASE_URL = "http://localhost:8080/api/v1/shops";

export async function fetchInventoryREST(shopId) {
  const response = await fetch(
    `${BASE_URL}/${shopId}/inventory/stems`,
    { headers: { Accept: "application/json" } }
  );

  if (!response.ok) {
    throw new Error("REST: Failed to fetch inventory");
  }

  return await response.json();
}
