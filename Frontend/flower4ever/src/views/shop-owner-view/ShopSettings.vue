<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchShopByIdGraphQL } from "@/services/api/userGraphqlService.js";

const route = useRoute();
const shopId = route.query.shopId || "";

const shop = ref(null);

const aboutText = ref("");
const deliveryInfo = ref("");

const successMessage = ref("");
const errorMessage = ref("");

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId);

    aboutText.value = shop.value?.aboutText || shop.value?.description || "";
    deliveryInfo.value = shop.value?.deliveryInfo || "";
  } catch (error) {
    console.error("Failed to load shop settings:", error);
  }
});

async function saveSettings() {
  try {
    const mutation = `
      mutation UpdateShopSettings(
        $shopId: ID!
        $aboutText: String
        $deliveryInfo: String
      ) {
        updateShopSettings(
          shopId: $shopId
          aboutText: $aboutText
          deliveryInfo: $deliveryInfo
        ) {
          id
          shopName
          aboutText
          deliveryInfo
        }
      }
    `;

    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          shopId: String(shopId),
          aboutText: aboutText.value,
          deliveryInfo: deliveryInfo.value,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    successMessage.value = "Settings saved successfully.";
    errorMessage.value = "";

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Failed to save settings:", error);

    errorMessage.value = "Failed to save settings.";
    successMessage.value = "";

    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
}
</script>

<template>
  <main class="bouquet-wrapper">
    <router-link
      :to="{ path: '/shop-owner-home', query: { shopId: shopId } }"
      class="back-link"
    >
      <span class="material-symbols-outlined">arrow_back</span>
      Back to Home
    </router-link>

    <div class="title-block">
      <h2>Shop Settings</h2>
      <p>Edit the information customers see on your shop profile.</p>
    </div>

    <section class="settings-card">
      <label>About Shop</label>
      <textarea
        v-model="aboutText"
        placeholder="Write something about your shop..."
      ></textarea>

      <label>Delivery Info</label>
      <textarea
        v-model="deliveryInfo"
        placeholder="Write delivery information..."
      ></textarea>

      <button @click="saveSettings">Save Settings</button>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </section>
  </main>
</template>

<style scoped>
.bouquet-wrapper {
  max-width: 1500px;
  margin: 100px auto 0 auto;
  padding-left: 0.5rem;
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  align-items: flex-start;
}

.title-block {
  width: 100%;
  margin-top: 0.1rem;
  margin-left: 0.2rem;
  text-align: left;
}

.title-block h2 {
  font-size: 2.35rem;
  color: #4b248c;
  margin: 0;
}

.title-block p {
  color: #7b5db2;
  margin-top: 0.25rem;
  font-size: 1rem;
}

.back-link {
  position: static;
  margin-left: 0.2rem;
  margin-top: -0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7a3ec8;
  font-weight: 500;
  text-decoration: none;
}

.settings-card {
  background: white;
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 4px 15px rgba(150, 94, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.settings-card label {
  font-weight: 600;
  color: #4b248c;
}

.settings-card textarea {
  min-height: 140px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: vertical;
  font-family: inherit;
}

.settings-card textarea:focus {
  outline: none;
  border-color: #7a3ec8;
}

.settings-card button {
  align-self: flex-start;
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 10px;
  background: #7a3ec8;
  color: white;
  font-weight: 500;
  cursor: pointer;
}

.success-message {
  background: #e8f8ec;
  color: #2e7d32;
  border: 1px solid #81c784;
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
}

.error-message {
  background: #fdeaea;
  color: #c62828;
  border: 1px solid #ef9a9a;
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
