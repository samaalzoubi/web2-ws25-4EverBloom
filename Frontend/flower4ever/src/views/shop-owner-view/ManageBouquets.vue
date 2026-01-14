<template>
  <main class="bouquet-wrapper">
    <router-link :to="{ path: '/shop-owner-home', query: { shopId: shopId } }" class="back-link">
      <span class="material-symbols-outlined">arrow_back</span>
      Back to Home
    </router-link>

    <div class="title-block">
      <h2>Manage Bouquets</h2>
      <p>Organize and update your bouquet creations.</p>
    </div>

    <div class="action-row">
      <a href="#" class="add-btn" @click.prevent="toggleForm">
        <span class="material-symbols-outlined">{{ showForm ? 'close' : 'add' }}</span>
        {{ showForm ? 'Cancel' : 'Create New Bouquet' }}
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
            <div class="price">€{{ (bouquet.price || bouquet.fixedPrice)?.toFixed(2) }}</div>
          </div>
          
          <p class="description">{{ bouquet.description }}</p>

          <div class="stock stock-green">
            In Stock
          </div>
          
          <div class="actions">
            <a href="#" class="view-btn disabled" @click.prevent>
               <span class="material-symbols-outlined" style="font-size: 18px;">visibility</span>
               View
            </a>
            <a href="#" class="edit-btn disabled" @click.prevent>
               <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
               Edit
            </a>
            <a href="#" class="delete-btn" @click.prevent="removeBouquet(bouquet.id)">
               <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
               Delete
            </a>
          </div>
        </div>
      </div>
    </section>

    <div v-if="errorMessage" class="page-error">
        {{ errorMessage }}
    </div>

    <div v-if="bouquets.length === 0" class="empty-state">
      <p>No bouquets found for this shop.</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchShopBouquetsGraphQL, createPremadeBouquet } from "@/services/api/bouquetGraphqlService.js";
import { deleteBouquet } from "@/services/api/bouquetRestService.js";

const route = useRoute();
const shopId = Number(route.query.shopId) || JSON.parse(localStorage.getItem('user'))?.id || 1;

const bouquets = ref([]);
const showForm = ref(false);
const errorMessage = ref('')

const form = ref({
  name: "",
  imageUrl: "",
  fixedPrice: null,
  description: ""
});

const loadBouquets = async () => {
  errorMessage.value = ''
  try {
  console.log(shopId)
    bouquets.value = await fetchShopBouquetsGraphQL(shopId);
  } catch (err) {
    errorMessage.value = err?.message || 'Failed to load bouquets.'
  }
};

const submitBouquet = async () => {
  errorMessage.value = ''
  try {
    await createPremadeBouquet(shopId, form.value);
    await loadBouquets();
    showForm.value = false;
    form.value = { name: "", imageUrl: "", fixedPrice: null, description: "" };
  } catch (err) {
    errorMessage.value = err?.message || 'Failed to create bouquet.'
  }
};

const removeBouquet = async (id) => {
  if (!confirm("Are you sure you want to delete this?")) return;

  errorMessage.value = ''
  try {
    await deleteBouquet(id);
    await loadBouquets();
  } catch (err) {
    errorMessage.value = err?.message || "Bouquet cannot be deleted."
  }
};

const toggleForm = () => { showForm.value = !showForm.value; };

onMounted(loadBouquets);
</script>

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
  box-shadow: 0 10px 30px rgba(120,60,200,0.12);
  transition: 0.3s;
}

.bouquet-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 38px rgba(80,30,150,0.18);
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

.description {
  margin: 0.4rem 0 0.7rem;
  color: #865ed1;
  font-size: 0.95rem;
}

.stock {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.stock-green { background: #e8ffee; color: #169444; }

.actions {
  display: flex;
  gap: 0.8rem;
}

.actions a {
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.view-btn { background: #f1e9ff; color: #6336c8; }
.edit-btn { background: #dcd2ff; color: #5a2db7; }
.delete-btn { background: #ffe6e6; color: #d34444; }

.actions a.disabled {
  background: #f0f0f0;
  color: #a0a0a0;
  cursor: not-allowed;
  opacity: 0.7;
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

.empty-state {
  text-align: center;
  padding: 3rem;
  width: 100%;
  color: #7b5db2;
}

.page-error {
  margin: 12px 0 6px 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: #ffecec;
  border: 1px solid #f5c2c2;
  color: #9f1c1c;
  font-weight: 500;
}

</style>