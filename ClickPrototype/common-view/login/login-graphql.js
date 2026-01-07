import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js";

// Generic GraphQL helper
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP error: ${response.status}`);
  }

  const body = await response.json();

  if (body.errors && body.errors.length) {
    throw new Error(body.errors[0].message);
  }

  return body.data;
}

// LOGIN
export async function loginGraphQL(email, password) {
  const mutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        username
        email
        role
      }
    }
  `;

  const data = await graphqlRequest(mutation, { email, password });
  return data.login;
}

export async function registerGraphQL(username, email, password, role) {
  const mutation = `
    mutation Register($request: RegisterRequest!) {
      registerUser(request: $request) {
        id
        username
        email
        role
      }
    }
  `;

  const variables = {
    request: {
      username,
      email,
      password,
      role
    }
  };

  const data = await graphqlRequest(mutation, variables);
  return data.registerUser;
}