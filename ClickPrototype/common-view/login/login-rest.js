import { REST_BASE } from "/ClickPrototype/config/api.config.js";

async function restRequest(path, method, body) {
  const response = await fetch(`${REST_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    let errorMessage = `REST error: ${response.status}`;

    try {
      const text = await response.text();
      if (text) {
        errorMessage = text;
      }
    } catch (_) {}

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function loginREST(email, password) {
  return restRequest("/users/login", "POST", {
    email,
    password
  });
}

export async function registerREST(username, email, password, role) {
  return restRequest("/users", "POST", {
    username,
    email,
    password,
    role
  });
}
