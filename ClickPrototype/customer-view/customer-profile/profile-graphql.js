import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js";

async function graphqlRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  const body = await res.json();

  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }

  return body.data;
}

export function updatePasswordGraphQL(id, password) {
  const mutation = `
    mutation UpdateUser($id: ID!, $password: String!) {
      updateUser(id: $id, password: $password) {
        id
      }
    }
  `;
  return graphqlRequest(mutation, { id, password });
}

export function deleteAccountGraphQL(id) {
  const mutation = `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `;
  return graphqlRequest(mutation, { id });
}
