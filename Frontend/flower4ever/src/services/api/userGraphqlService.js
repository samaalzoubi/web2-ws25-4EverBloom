import { GRAPHQL_BASE } from "@/config/api.config.js";

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

//GET /users/owners
export async function fetchShopsGraphQL() {
  const query = `
    query {
      allOwners {
        id
        username
        shopName
        logo
        link
        phoneNumber
        description
        flowerShopType
        latitude
        longitude
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

export async function fetchShopByIdGraphQL(shopId) {
  const query = `
    query ($id: ID!) {
      userById(id: $id) {
        id
        role
        shopName
        description
        phoneNumber
        link
        logo
        address {
          streetAddress
          zipCode
          city
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: shopId } })
  });

  const result = await response.json();
  if (result.errors) throw new Error("GraphQL returned errors");
  return result.data.userById;
}
