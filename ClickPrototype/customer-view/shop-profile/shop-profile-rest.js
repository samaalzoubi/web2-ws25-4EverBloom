import { REST_BASE } from "/ClickPrototype/config/api.config.js";

export async function fetchShopByIdREST(shopId) {
  const url = `${REST_BASE}/users/${shopId}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch owner information");
  }
  return await response.json();
}

export async function fetchShopBouquets(shopId) {
    const url = `${REST_BASE}/bouquet/shops/${shopId}`;

    const response = await fetch(url, {
        headers: { Accept: "application/json" }
    })
    
    if (!response.ok) {
        throw new Error(`REST failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}