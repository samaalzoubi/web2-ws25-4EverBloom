<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShopByIdGraphQL } from '@/services/api/userGraphqlService.js'
import { fetchShopBouquetsGraphQL } from '@/services/api/bouquetGraphqlService.js'
import BouquetCard from '@/components/BouquetCard.vue'
import Chatbot from '@/components/Order/Chatbot.vue'

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
  <main class="shop-profile-page">
    <!-- Shop Header -->
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
          <strong>Website:</strong> <a :href="shop.link" target="_blank">{{ shop.link }}</a><br />
          <strong>Address:</strong>
          {{ shop.address?.streetAddress }}, {{ shop.address?.city }},
          {{ shop.address?.zipCode }}
        </p>
      </div>
    </section>

    <!-- Tabs Placeholder -->
    <nav class="shop-tabs">
      <a href="#" class="active">Catalog</a>
      <a href="#">About</a>
      <a href="#">Subscriptions</a>
      <a href="#">Reviews</a>
      <a href="#">Delivery Info</a>
    </nav>

    <!-- Catalog Section -->
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

    <!-- Chatbot -->
    <Chatbot />
  </main>
</template>

<style scoped>
.shop-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
}

.shop-name-with-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shop-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
}

.shop-details {
  min-width: 300px;
  text-align: right;
}

.shop-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-bottom: 1px solid #e4e4e4;
  padding: 1rem;
}

.shop-tabs a {
  color: inherit;
  text-decoration: none;
}

.shop-tabs a.active {
  border-bottom: 2px solid var(--color-accent-light);
}

.bouquet-section {
  padding: 2rem 4rem;
}

.bouquet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
