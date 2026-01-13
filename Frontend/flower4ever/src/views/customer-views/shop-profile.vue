<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShopByIdGraphQL } from '@/services/api/userGraphqlService.js'
import { fetchShopBouquetsGraphQL } from '@/services/api/bouquetGraphqlService.js'
import BouquetCard from '@/components/BouquetCard.vue'

const route = useRoute()
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
          {{ shop.address?.streetAddress }}, {{ shop.address?.city }}, {{ shop.address?.zipCode }}
        </p>
      </div>
    </section>

    <!-- ===== NAVIGATION TABS ===== -->
    <nav class="shop-tabs">
      <a href="#" class="active">Catalog</a>
      <a href="#">About</a>
      <a href="#">Subscriptions</a>
      <a href="#">Reviews</a>
      <a href="#">Delivery Info</a>
    </nav>

    <!-- ===== BOUQUETS GRID ===== -->
    <section class="bouquet-section">
      <h2>Catalog</h2>
      <div class="bouquet-grid">
        <BouquetCard
          v-for="b in bouquets"
          :key="b.id"
          :bouquet="b"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 40px 0px;
  margin-top: 67px;
  flex-direction: column;
}

.shop-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 5rem 2.5rem 5rem;
  margin: 0;
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
  letter-spacing: 1px;
}

.shop-title .tagline {
  font-style: italic;
  color: #888;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.shop-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
}

.shop-details {
  flex: 1;
  min-width: 300px;
  line-height: 1.8;
  font-size: 1rem;
  text-align: right;
  color: var(--color-text-dark);
}

.shop-details a {
  color: #2b6a9b;
  text-decoration: none;
}

.shop-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  background: var(--color-header-background);
  border-bottom: 1px solid #e4e4e4;
  padding: 1rem;
  width: 100%;
}

.shop-tabs a.active,
.shop-tabs a:hover {
  border-bottom: 2px solid var(--color-hover);
  color: var(--color-hover);
}

.bouquet-section {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.bouquet-section h2 {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding-bottom: 0.3rem;
}

.bouquet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
