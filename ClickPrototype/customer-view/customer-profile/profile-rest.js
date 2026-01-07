import { REST_BASE } from "/ClickPrototype/config/api.config.js";

async function restRequest(path, method, body) {
  const response = await fetch(`${REST_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `REST error ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export function updatePasswordREST(userId, password) {
  return restRequest(`/users/${userId}`, "PUT", { password });
}

export function deleteAccountREST(userId) {
  return restRequest(`/users/${userId}`, "DELETE");
}
