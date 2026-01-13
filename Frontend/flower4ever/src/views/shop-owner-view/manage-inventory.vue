<template>
  <main class="inventory-wrapper">
    <section class="inventory-content">
      <RouterLink 
        class="back-link" 
        :to="{ path: '/shop-owner-home', query: { shopId: shopId } }"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Home
      </RouterLink>

      <div class="title-block">
        <h2>Inventory</h2>
        <p>Track and manage your flower stems and stock levels.</p>
      </div>

      <div class="action-row">
        <button class="add-btn" @click="showCreate = !showCreate">
          <span class="material-symbols-outlined">{{ showCreate ? 'close' : 'add' }}</span>
          {{ showCreate ? 'Cancel' : 'Add New Item' }}
        </button>
      </div>

      <form v-if="showCreate" class="create-form" @submit.prevent="create">
        <input v-model="form.flowerName" placeholder="Flower name" required />
        <input v-model="form.flowerColor" placeholder="Color" required />
        <input v-model="form.flowerSeason" placeholder="Season" required />
        <input v-model="form.imageUrl" placeholder="Image URL" required />
        
        <input v-model.number="form.price" type="number" step="0.01" placeholder="Price (€)" required />
        <input v-model.number="form.quantity" type="number" placeholder="Quantity" required />
        
        <button type="submit">Save Item</button>
      </form>

      <div class="inventory-table" v-if="!error">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Color</th>
              <th>Season</th>
              <th>Quantity</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stem in stems" :key="stem.stemId">
              <td>{{ stem.flowerName }}</td>
              <td>{{ stem.flowerColor }}</td>
              <td>{{ stem.flowerSeason }}</td>
              <td>{{ stem.quantity }}</td>
              <td>€{{ stem.price ? stem.price.toFixed(2) : '0.00' }}</td>
              <td>
                <button class="delete-btn" @click="remove(stem.stemId)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="error" class="error-msg">
        {{ error }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  fetchShopStems,
  createShopStem,
  deleteShopStem
} from "@/services/shop-inventory.service";

const route = useRoute();

// Robust shopId retrieval
const shopId = Number(route.query.shopId) || JSON.parse(localStorage.getItem('user') || '{}').shopId;

const stems = ref([]);
const showCreate = ref(false);
const error = ref("");

const form = ref({
  flowerName: "",
  flowerColor: "",
  flowerSeason: "",
  quantity: null,
  price: null,
  imageUrl: ""
});

async function load() {
  if (!shopId) {
    error.value = "Missing shopId.";
    return;
  }
  try {
    stems.value = await fetchShopStems(shopId);
  } catch (err) {
    console.error("Load failed:", err);
    error.value = "Failed to load inventory.";
  }
}

async function create() {
  try {
    await createShopStem(shopId, form.value);
    await load();
    showCreate.value = false;
    // Reset to null to keep placeholders visible
    form.value = {
      flowerName: "",
      flowerColor: "",
      flowerSeason: "",
      quantity: null,
      price: null,
      imageUrl: ""
    };
  } catch (err) {
    console.error("Create failed:", err);
    alert("Failed to create item.");
  }
}

async function remove(stemId) {
  if (!confirm("Delete this item? Note: Stems linked to bouquets cannot be removed.")) return;
  try {
    await deleteShopStem(shopId, stemId);
    await load();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed. This item might be used in a bouquet.");
  }
}

onMounted(load);
</script>

<style scoped>
/* Layout styles matched to manage-inventory.css */

.inventory-wrapper {
  gap: 2rem;
  width: 100%;
  margin: 120px auto;
  padding: 0 2rem;
  display: flex;
}

.inventory-content {
  padding-right: 1rem;
  width: 80vw;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7a3ec8;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
}

.back-link span {
  font-size: 20px;
}

.title-block h2 {
  font-size: 2rem;
  color: #4b248c;
  margin: 0;
}

.title-block p {
  margin-top: 0.3rem;
  color: #7b5db2;
}

.action-row {
  margin: 1.5rem 0;
}

.add-btn {
  background: #7a3ec8;
  color: white;
  padding: 0.8rem 1.4rem;
  border-radius: 12px;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  cursor: pointer;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
  max-width: 420px;
  margin-bottom: 1.5rem;
  background: #fdfbff;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e9e0f7;
}

.create-form input {
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #d6c7ef;
}

.create-form button {
  background: #7a3ec8;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.inventory-table {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-height: 420px;
  overflow-y: auto;
}

.inventory-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.inventory-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  padding: 14px 16px;
  font-weight: 600;
  text-align: left;
  color: #4b3c8a;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.inventory-table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: #333;
  vertical-align: middle;
}

.inventory-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.45);
}

.inventory-table tbody tr:hover {
  background: rgba(183, 155, 211, 0.2);
}

.inventory-table th:last-child,
.inventory-table td:last-child {
  text-align: right;
  white-space: nowrap;
}

.delete-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: #4b3c8a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ff4d4d;
  color: #fff;
  border-color: transparent;
}

.error-msg {
  color: red;
  margin-top: 1rem;
}

@media (max-width: 800px) {
  .inventory-table {
    max-height: none;
  }
  .inventory-table table {
    min-width: 650px;
  }
}
</style>