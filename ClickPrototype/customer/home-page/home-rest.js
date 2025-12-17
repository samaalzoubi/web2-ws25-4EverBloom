import { REST_BASE } from "../../config/api.config.js";

export async function fetchFlowersREST() {
    const url = `${REST_BASE}/bouquet/premade/latest`;

    const response = await fetch(url, {
        headers: { Accept: "application/json" }
    })
    
    if (!response.ok) {
        throw new Error(`REST failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

export async function addToCartREST(userId, bouquetId) {
  const url = `${REST_BASE}/cart/${userId}/items?bouquetId=${bouquetId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Add to cart failed: ${response.status}`);
  }

  return await response.json();
}

export async function getActiveCartREST(userId) {
  const response = await fetch(`${REST_BASE}/cart/${userId}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Get cart failed (${response.status})`);
  }
  return await response.json();
}

export async function patchCartItemQuantity(userId, itemId, quantityDelta) {
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
