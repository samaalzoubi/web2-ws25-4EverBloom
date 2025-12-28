import { REST_BASE } from "@/config/api.config";

export async function addToCartREST(userId, bouquetId) {
  const url = `${REST_BASE}/cart/${userId}/items?bouquetId=${bouquetId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    let message = "Could not add item to cart.";
    const errorBody = await response.json();
    if (errorBody && errorBody.message) {
      message = errorBody.message;
    }

    throw new Error(message);
  }

  return await response.json();
}

export async function getActiveCartREST(userId) {
  console.log(userId)
  const response = await fetch(`${REST_BASE}/cart/${userId}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Get cart failed (${response.status})`);
  }
  return await response.json();
}

export async function patchCartItemQuantityREST(userId, itemId, quantityDelta) {
  const url = `${REST_BASE}/cart/${userId}/items/${itemId}?quantityDelta=${encodeURIComponent(quantityDelta)}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Update quantity failed (${response.status})`);
  }

  return await response.json();
}

export async function clearCartREST(userId) {
  const url = `${REST_BASE}/cart/${userId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Clear cart failed (${response.status})`);
  }

  return true;
}

