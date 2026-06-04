<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchShopByIdGraphQL } from "@/services/api/userGraphqlService.js";
import { fetchShopBouquetsGraphQL } from "@/services/api/bouquetGraphqlService.js";
import BouquetCard from "@/components/BouquetCard.vue";
import { useCartStore } from "@/stores/cartStore";

const route = useRoute();
const cartStore = useCartStore();

const shopId = route.query.shopId || "";

const shop = ref(null);
const bouquets = ref([]);
const activeTab = ref("catalog");

/* ===== REVIEWS ===== */
const reviews = ref([
  {
    name: "Sarah M.",
    rating: 5,
    comment: "The bouquet was very beautiful and fresh.",
  },
  {
    name: "Daniel K.",
    rating: 4,
    comment: "Very good service and fast delivery.",
  },
  {
    name: "Emma L.",
    rating: 5,
    comment: "Amazing flowers and nice packaging.",
  },
]);

/* ===== AVERAGE RATING ===== */
const averageRating = computed(() => {
  if (!reviews.value.length) return 0;

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);

  return (total / reviews.value.length).toFixed(1);
});

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId);
    bouquets.value = await fetchShopBouquetsGraphQL(shopId);
  } catch (error) {
    console.error("Failed to load shop profile:", error);
  }
});

function handleAddToCart(bouquet) {
  cartStore.addBouquet(bouquet.id);
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
          <strong>Phone: </strong> {{ shop.phoneNumber }}
          <br />

          <strong>Website: </strong>
          <a :href="shop.link" target="_blank">
            {{ shop.link }}
          </a>
          <br />

          <strong>Address: </strong>
          {{ shop.address?.streetAddress }}, {{ shop.address?.city }},
          {{ shop.address?.zipCode }}
          <br />

          <strong>Rating: </strong>
          <span> {{ averageRating }}/5 ⭐ </span>
        </p>
      </div>
    </section>

    <!-- ===== NAVIGATION TABS ===== -->
    <nav class="shop-tabs">
      <span
        class="tab"
        :class="{ active: activeTab === 'catalog' }"
        @click="activeTab = 'catalog'"
      >
        Catalog
      </span>

      <span
        class="tab"
        :class="{ active: activeTab === 'about' }"
        @click="activeTab = 'about'"
      >
        About
      </span>

      <span
        class="tab"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'"
      >
        Reviews
      </span>

      <span
        class="tab"
        :class="{ active: activeTab === 'delivery' }"
        @click="activeTab = 'delivery'"
      >
        Delivery Info
      </span>
    </nav>

    <!-- ===== CATALOG ===== -->
    <section class="bouquet-section" v-if="activeTab === 'catalog'">
      <h2>Catalog</h2>

      <div class="bouquet-grid" v-if="bouquets.length">
        <BouquetCard
          v-for="b in bouquets"
          :key="b.id"
          :bouquet="b"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <p v-else>No bouquets available at the moment.</p>
    </section>

    <!-- ===== ABOUT ===== -->
    <section class="tab-section" v-if="activeTab === 'about' && shop">
      <h2>About</h2>

      <p>
        {{ shop.shopName }} is a flower shop that offers beautiful and fresh
        bouquets for birthdays, weddings, anniversaries and special events.
      </p>

      <p>
        {{ shop.description || "No additional description is available." }}
      </p>

      <p>
        The shop is located in
        {{ shop.address?.city || "the local area" }}
        and focuses on quality, creativity and customer satisfaction.
      </p>
    </section>

    <!-- ===== REVIEWS ===== -->
    <section class="tab-section" v-if="activeTab === 'reviews'">
      <h2>Customer Reviews</h2>

      <div class="review-card" v-for="(review, index) in reviews" :key="index">
        <h3>{{ review.name }}</h3>

        <p class="stars">
          {{ "⭐".repeat(review.rating) }}
        </p>

        <p>{{ review.comment }}</p>
      </div>
    </section>

    <!-- ===== DELIVERY INFO ===== -->
    <section class="tab-section" v-if="activeTab === 'delivery'">
      <h2>Delivery Information</h2>

      <p>
        This shop offers local delivery for customers in the surrounding area.
      </p>

      <p><strong>Delivery available:</strong> Yes</p>

      <p><strong>Delivery time:</strong> Usually within 1–2 business days.</p>

      <p>
        <strong>Same-day delivery:</strong>
        Possible depending on availability.
      </p>

      <p>
        <strong>Delivery area:</strong>
        {{ shop?.address?.city || "Local city area" }}
        and nearby locations.
      </p>

      <p>
        <strong>Note:</strong>
        Delivery details may depend on the selected bouquet and order time.
      </p>
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
  cursor: pointer;
}

.shop-tabs .tab.active {
  color: var(--color-hover);
  border-bottom: 2px solid var(--color-hover);
}

/* ===== BOUQUET GRID ===== */
.bouquet-section {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.bouquet-section h2,
.tab-section h2 {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.bouquet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* ===== TAB CONTENT ===== */
.tab-section {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
}

/* ===== REVIEWS ===== */
.review-card {
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background: #fff;
}

.review-card h3 {
  margin: 0 0 0.3rem;
}

.stars {
  color: #f5b301;
  font-size: 1.2rem;
  margin: 0.3rem 0;
}
</style>
