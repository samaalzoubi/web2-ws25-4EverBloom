<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchShopByIdGraphQL } from "@/services/api/userGraphqlService.js";

const route = useRoute();
const shopId = route.query.shopId || "";
const shop = ref(null);

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

const averageRating = computed(() => {
  if (!reviews.value.length) return "0.0";

  const total = reviews.value.reduce((sum, review) => {
    return sum + review.rating;
  }, 0);

  return (total / reviews.value.length).toFixed(1);
});

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId);
  } catch (error) {
    console.error("Failed to load comments:", error);
  }
});
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
      <h2>Customer Comments</h2>
      <p>Here you can view and manage customer feedback about your bouquets.</p>
      <p>Average Rating: {{ averageRating }}/5 ⭐</p>
    </div>

    <div class="comments-page">
      <div v-if="reviews.length">
        <h2>Customer Reviews</h2>
        <div class="comment-card" v-for="review in reviews" :key="review.id">
          <h3>{{ review.name }}</h3>

          <p class="stars">
            {{ "⭐".repeat(review.rating) }}
          </p>

          <p>{{ review.comment }}</p>
        </div>
      </div>

      <p v-else>No customer comments available yet.</p>
    </div>
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

.comments-page {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
}

.comments-page h2 {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.comment-card {
  background: white;
  border-radius: 16px;
  padding: 1.3rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(150, 94, 255, 0.1);
}

.comment-card h3 {
  margin: 0 0 0.4rem;
}

.stars {
  color: #f5b301;
}
</style>
