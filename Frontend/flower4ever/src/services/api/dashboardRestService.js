import { REST_BASE } from "@/config/api.config";

export async function fetchTopProductsREST({
    shopId,
    sortBy = null,
    startDate = null,
    endDate = null
}) {
  const params = new URLSearchParams();

  params.append("shopId", shopId);

  if (sortBy) {
    params.append("sortBy", sortBy);
  }

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const url = `${REST_BASE}/dashboard/top-products?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `REST failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}