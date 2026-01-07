import { GRAPHQL_BASE } from "/ClickPrototype/config/api.config.js";

//Generic GraphQL helper
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
    throw new Error(`GraphQL HTTP error: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  if (body.errors && body.errors.length) {
    const message = body.errors[0].message || "Unknown GraphQL error";
    throw new Error(message);
  }

  return body.data;
}

export async function fetchOwnersGraphQL() {
  const query = `
    query {
      allOwners {
        id
        username
        email
        role
        shopName
        flowerShopType
        logo
        address {
          streetAddress
          zipCode
          city
          state
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.allOwners;
}

export async function fetchUserByIdGraphQL(id) {
  const query = `
    query UserById($id: ID!) {
      userById(id: $id) {
        id
        username
        email
        role
      }
    }
  `;

  const data = await graphqlRequest(query, { id });
  return data.userById;
}

export async function registerUserGraphQL(user) {
  const mutation = `
    mutation RegisterUser($request: RegisterRequest!) {
      registerUser(request: $request) {
        id
        username
        email
        role
      }
    }
  `;

  const data = await graphqlRequest(mutation, {
    request: {
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    }
  });

  return data.registerUser;
}

export async function loginGraphQL(email, password) {
  const mutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        username
        role
      }
    }
  `;

  const data = await graphqlRequest(mutation, { email, password });
  return data.login;
}

export async function updateUserGraphQL(id, updates) {
  const mutation = `
    mutation UpdateUser(
      $id: ID!
      $username: String
      $email: String
      $password: String
    ) {
      updateUser(
        id: $id
        username: $username
        email: $email
        password: $password
      ) {
        id
        username
        email
      }
    }
  `;

  const variables = { id, ...updates };
  const data = await graphqlRequest(mutation, variables);
  return data.updateUser;
}

export async function deleteUserGraphQL(id) {
  const mutation = `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `;

  const data = await graphqlRequest(mutation, { id });
  return data.deleteUser;
}

