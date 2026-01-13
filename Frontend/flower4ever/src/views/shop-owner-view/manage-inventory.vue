<template>
  <main class="inventory-wrapper">
    <section class="inventory-content">
      <RouterLink class="back-link" :to="`/shop-owner-homepage?shopId=${shopId}`">
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Home
      </RouterLink>

      <div class="title-block">
        <h2>Inventory</h2>
        <p>Track and manage your flower stems and stock levels.</p>
      </div>

      <div class="action-row">
        <button class="add-btn" @click="showCreate = !showCreate">
          <span class="material-symbols-outlined">add</span>
          Add New Item
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

      <div class="inventory-table">
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
              <td>€{{ stem.price.toFixed(2) }}</td>
              <td>
                <button class="delete-btn" @click="remove(stem.stemId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchShopStems, createShopStem, deleteShopStem } from "@/services/shop-inventory.service";

const route = useRoute();
const shopId = Number(route.query.shopId);
const stems = ref([]);
const showCreate = ref(false);

const form = ref({
  flowerName: "",
  flowerColor: "",
  flowerSeason: "",
  quantity: 0,
  price: 0,
  imageUrl: ""
});

async function load() {
  stems.value = await fetchShopStems(shopId);
}

async function create() {
  await createShopStem(shopId, form.value);
  await load();
  showCreate.value = false;
  form.value = {
    flowerName: "",
    flowerColor: "",
    flowerSeason: "",
    quantity: 0,
    price: 0,
    imageUrl: ""
  };
}

async function remove(stemId) {
  if (confirm("Delete this item?")) {
    await deleteShopStem(shopId, stemId);
    await load();
  }
}

onMounted(load);
</script>

<style scoped>
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

.title-block h2 {
  font-size: 2rem;
  color: #4b248c;
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
  background: #9f7cc1;
  color: #fff;
  border-color: transparent;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 400px;
  margin-bottom: 1rem;
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
}
</style>
