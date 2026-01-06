import { REST_BASE } from "@/config/api.config";

export async function fetchShopsREST() {
  const url = `${REST_BASE}/users/owners`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch owners");
  }
  return await response.json();
}