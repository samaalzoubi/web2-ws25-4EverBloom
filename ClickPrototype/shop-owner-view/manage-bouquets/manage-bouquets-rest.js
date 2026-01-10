import { REST_BASE } from "/ClickPrototype/config/api.config.js"

export async function createBouquet(shopId, data) {
  const response = await fetch(`${REST_BASE}/bouquet/shops/${shopId}/premade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to create bouquet");
  }

  return await response.json();
}

export async function deleteBouquet(bouquetId) {
  const response = await fetch(`${REST_BASE}/bouquet/${bouquetId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Delete failed (HTTP ${response.status})`);
  }
}
