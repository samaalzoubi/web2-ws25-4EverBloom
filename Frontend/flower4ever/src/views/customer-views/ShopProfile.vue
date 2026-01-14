<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShopByIdGraphQL } from '@/services/api/userGraphqlService.js'
import { fetchShopBouquetsGraphQL } from '@/services/api/bouquetGraphqlService.js'
import BouquetCard from '@/components/BouquetCard.vue'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const cartStore = useCartStore()
const shopId = route.query.shopId || ''

const shop = ref(null)
const bouquets = ref([])

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId)
    bouquets.value = await fetchShopBouquetsGraphQL(shopId)
  } catch (error) {
    console.error('Failed to load shop profile:', error)
  }
})

function handleAddToCart(bouquet) {
  cartStore.addBouquet(bouquet.id)
}
</script>

<template>
  <main>
    <!-- ===== SHOP INFO ===== -->
    <section class="shop-info" v-if="shop">
      <div class="shop-title">
        <div class="shop-name-with-logo">
          <img :src="shop.logo" alt="Shop Logo" class="shop-logo" />
          <div>
            <h2>{{ shop.shopName }}</h2>
            <p class="tagline">{{ shop.description }}</p>
          </div>
        </div>
      </div>

      <div class="shop-details">
        <p>
          <strong>Phone:</strong> {{ shop.phoneNumber }}<br />
          <strong>Website:</strong>
          <a :href="shop.link" target="_blank">{{ shop.link }}</a><br />
          <strong>Address:</strong>
          {{ shop.address?.streetAddress }},
          {{ shop.address?.city }},
          {{ shop.address?.zipCode }}
        </p>
      </div>
    </section>

    <!-- ===== NAVIGATION TABS (STATIC) ===== -->
    <nav class="shop-tabs">
      <span class="tab active">Catalog</span>
      <span class="tab disabled">About</span>
      <span class="tab disabled">Subscriptions</span>
      <span class="tab disabled">Reviews</span>
      <span class="tab disabled">Delivery Info</span>
    </nav>

    <!-- ===== BOUQUETS GRID ===== -->
    <section class="bouquet-section">
      <h2>Catalog</h2>
      <div class="bouquet-grid">
        <BouquetCard
          v-for="b in bouquets"
          :key="b.id"
          :bouquet="b"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ===== PAGE LAYOUT ===== */
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  margin-top: 67px;
}

/* ===== SHOP HEADER ===== */
.shop-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 5rem 2.5rem;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
  width: 100%;
}

.shop-title {
  flex: 1;
  min-width: 300px;
}

.shop-name-with-logo {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.shop-title h2 {
  font-family: "Playfair Display", serif;
  font-size: 2.8rem;
  margin: 0;
}

.tagline {
  font-style: italic;
  color: #888;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.shop-logo {
  height: 80px;
  border-radius: 8px;
}

.shop-details {
  min-width: 300px;
  line-height: 1.8;
  text-align: right;
}

/* ===== TABS ===== */
.shop-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  background: var(--color-header-background);
  border-bottom: 1px solid #e4e4e4;
  padding: 1rem;
  width: 100%;
}

.shop-tabs .tab {
  font-weight: 500;
  padding-bottom: 0.3rem;
}

/* ACTIVE TAB (Catalog only) */
.shop-tabs .tab.active {
  color: var(--color-hover);
  border-bottom: 2px solid var(--color-hover);
  cursor: default;
}

/* DISABLED TABS */
.shop-tabs .tab.disabled {
  color: #9ca3af;        /* light grey */
  opacity: 0.6;
  cursor: default;
  pointer-events: none; /* disables hover + click */
  border-bottom: none;
}
/* Prevent hover highlighting on disabled tabs */
.shop-tabs .tab.disabled:hover {
  color: #9ca3af;
  border-bottom: none;
}
/* ===== BOUQUET GRID ===== */
.bouquet-section {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.bouquet-section h2 {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.bouquet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
