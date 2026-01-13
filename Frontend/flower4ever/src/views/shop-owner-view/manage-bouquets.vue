<template>
  <main class="bouquet-wrapper">
    <router-link to="/" class="back-link">
      <span class="material-symbols-outlined">arrow_back</span>
      Back to Home
    </router-link>

    <div class="title-block">
      <h2>Manage Bouquets</h2>
      <p>Organize and update your bouquet creations.</p>
    </div>

    <div class="action-row">
      <a href="#" class="add-btn" @click.prevent="toggleForm">
        <span class="material-symbols-outlined">add</span>
        Create New Bouquet
      </a>
    </div>

    <form v-if="showForm" class="create-form" @submit.prevent="submitBouquet">
      <input v-model="form.name" placeholder="Bouquet name" required />
      <input v-model="form.imageUrl" placeholder="Image URL" required />
      <input v-model.number="form.fixedPrice" type="number" step="0.01" placeholder="Price (€)" required />
      <textarea v-model="form.description" placeholder="Description"></textarea>
      <button type="submit">Save Bouquet</button>
    </form>

    <section class="bouquet-grid">
      <div v-for="bouquet in bouquets" :key="bouquet.id" class="bouquet-card">
        <div class="image-box">
          <img :src="bouquet.imageUrl" alt="Bouquet Image" />
        </div>
        <div class="card-details">
          <div class="top-row">
            <h3>{{ bouquet.name }}</h3>
            <div class="price">€{{ bouquet.price }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchShopBouquetsGraphQL, createPremadeBouquet } from "@/services/api/bouquetGraphqlService.js";

const route = useRoute();
const shopId = route.query.shopId || 1;

const bouquets = ref([]);
const showForm = ref(false);

const form = ref({
  name: "",
  imageUrl: "",
  fixedPrice: null,
  description: ""
});

const loadBouquets = async () => {
  try {
    bouquets.value = await fetchShopBouquetsGraphQL(shopId);
  } catch (err) {
    console.error("Failed to load bouquets:", err);
  }
};

const submitBouquet = async () => {
  try {
    await createPremadeBouquet(shopId, form.value);
    await loadBouquets();
    showForm.value = false;
    form.value = { name: "", imageUrl: "", fixedPrice: null, description: "" };
  } catch (err) {
    console.error("Failed to create bouquet:", err);
  }
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};

onMounted(loadBouquets);
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background: #f5efff;
  margin: 0;
}

/* WRAPPER */
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

.action-row {
  display: flex;
  gap: 1rem;
  margin-top: 0.9rem;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
}

.add-btn {
  background: #7a3ec8;
  color: white;
  padding: 0.85rem 1.4rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(120, 60, 200, 0.25);
  transition: 0.25s;
}

.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 35px rgba(120, 60, 200, 0.3);
}

.bouquet-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 1rem;
  width: 100%;
}

.bouquet-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(120, 60, 200, 0.12);
  transition: 0.3s;
}

.bouquet-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 38px rgba(80, 30, 150, 0.18);
}

.image-box {
  height: 210px;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-details {
  padding: 1.3rem 1.5rem;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-row h3 {
  margin: 0;
  color: #4b248c;
  font-size: 1.25rem;
}

.price {
  color: #4b248c;
  font-weight: 600;
}

.create-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 420px;
}

.create-form input,
.create-form textarea {
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
