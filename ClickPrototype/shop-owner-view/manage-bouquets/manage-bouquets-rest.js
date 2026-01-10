const BASE_URL = "http://localhost:8080/api/v1/bouquet";

export async function createBouquet(shopId, data) {
  const response = await fetch(`${BASE_URL}/shops/${shopId}/premade`, {
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
  const response = await fetch(`${BASE_URL}/${bouquetId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Delete failed (HTTP ${response.status})`);
  }
}
