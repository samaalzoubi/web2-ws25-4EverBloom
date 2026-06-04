<template>
  <div>
    <section class="welcome-banner">
      <div class="welcome-content">
        <h2>Welcome back! <span class="emoji">🌸</span></h2>
        <p>Manage your shop, bouquets, inventory, and orders.</p>
      </div>
    </section>

    <main class="owner-home-container">
      <section class="feature-grid">
        <RouterLink
          class="feature-card"
          :to="{ path: '/dashboard', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">home</span>
          </div>
          <h3>Dashboard</h3>
          <p>View shop statistics</p>
        </RouterLink>

        <RouterLink
          class="feature-card"
          :to="{ path: '/manage-bouquets', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">local_florist</span>
          </div>
          <h3>Manage Bouquets</h3>
          <p>Create & delete bouquets</p>
        </RouterLink>

        <RouterLink
          class="feature-card"
          :to="{ path: '/manage-inventory', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">inventory_2</span>
          </div>
          <h3>Manage Inventory</h3>
          <p>Manage stems & stock</p>
        </RouterLink>

        <RouterLink
          class="feature-card"
          :to="{ path: '/admin-orders', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">shopping_bag</span>
          </div>
          <h3>Orders</h3>
          <p>View customer orders</p>
        </RouterLink>

        <div class="feature-card disabled">
          <div class="icon-box">
            <span class="material-symbols-outlined">chat</span>
          </div>
          <h3>Messages</h3>
          <p>Coming soon</p>
        </div>

        <RouterLink
          class="feature-card"
          :to="{ path: '/ownerProfileEdit', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">storefront</span>
          </div>
          <h3>Shop Profile</h3>
          <p>Edit shop information</p>
        </RouterLink>

        <RouterLink
          class="feature-card"
          :to="{ path: '/shop-comments', query: { shopId: shopId } }"
        >
          <div class="icon-box">
            <span class="material-symbols-outlined">chat</span>
          </div>
          <h3>Comments</h3>
          <p>Customer comments</p>
        </RouterLink>

        <div class="feature-card disabled">
          <div class="icon-box">
            <span class="material-symbols-outlined">settings</span>
          </div>
          <h3>Settings</h3>
          <p>Coming soon</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const shopId = ref(null);

onMounted(() => {
  const urlShopId = route.query.shopId;
  const storedUser = JSON.parse(localStorage.getItem("user"))?.id;

  shopId.value = urlShopId || storedUser || 1;

  console.log("Current Shop ID initialized to:", shopId.value);
});
</script>

<style scoped>
.welcome-banner {
  margin-top: 120px;
  width: 100%;
  background: linear-gradient(90deg, #f8efff, #f4e8ff, #f0e4ff);
  padding: 2.8rem 0;
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  box-shadow: 0 3px 12px rgba(140, 60, 255, 0.08);
}

.welcome-content {
  max-width: 1100px;
  width: 100%;
  padding: 0 2rem;
}

.welcome-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: #46248a;
}

.welcome-content p {
  margin: 0;
  font-size: 1.05rem;
  color: #7a5ab2;
}

.emoji {
  font-size: 1.7rem;
}

.owner-home-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.8rem;
}

.feature-card {
  background: white;
  padding: 1.6rem;
  border-radius: 18px;
  height: 190px;
  box-shadow: 0 4px 15px rgba(150, 94, 255, 0.1);
  text-decoration: none;
  color: #472891;
  display: flex;
  flex-direction: column;
  transition: 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(150, 94, 255, 0.18);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #f2e4ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-box span {
  font-size: 26px;
  color: #7a3ec8;
}

.feature-card h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 600;
}

.feature-card p {
  margin: 0;
  font-size: 0.95rem;
  color: #8d6ec8;
}

.feature-card.disabled {
  pointer-events: none;
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 1000px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 760px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .feature-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
