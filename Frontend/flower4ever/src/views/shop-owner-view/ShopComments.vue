<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchShopByIdGraphQL } from "@/services/api/userGraphqlService.js";

const route = useRoute();
const shopId = route.query.shopId || "";

const shop = ref(null);
const reviews = ref([]);

const currentUser = JSON.parse(localStorage.getItem("user"));

const averageRating = computed(() => {
  if (!reviews.value.length) return "0.0";

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.value.length).toFixed(1);
});

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId);

    const orders = await fetchOrdersByShop(shopId);
    console.log("shopId:", shopId);
    console.log("ordersByShop:", orders);

    const ratingLists = await Promise.all(
      orders.map((order) => fetchRatingsByOrder(order.orderId)),
    );

    reviews.value = ratingLists.flat().map((rating) => {
      const matchingOrder = orders.find(
        (order) => Number(order.orderId) === Number(rating.orderId),
      );

      return {
        id: rating.id,
        name: `Customer #${matchingOrder?.customerId || rating.customerId}`,
        rating: rating.ratingScore,
        comment: rating.review,
        orderId: rating.orderId,
        customerId: matchingOrder?.customerId || rating.customerId,
      };
    });
  } catch (error) {
    console.error("Failed to load comments:", error);
  }
});

async function fetchOrdersByShop(shopId) {
  const query = `
    query OrdersByShop($shopId: ID!) {
      ordersByShop(shopId: $shopId) {
        orderId
        customerId
        status
        orderDate
      }
    }
  `;

  const response = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        shopId: String(shopId),
      },
    }),
  });

  const result = await response.json();

  return result.data?.ordersByShop || [];
}

async function fetchRatingsByOrder(orderId) {
  const query = `
    query RatingsByOrder($orderId: Int!) {
      ratingsByOrder(orderId: $orderId) {
        id
        ratingScore
        review
        orderId
        customerId
      }
    }
  `;

  const response = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        orderId: Number(orderId),
      },
    }),
  });

  const result = await response.json();
  return result.data?.ratingsByOrder || [];
}
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
      <p>Here you can view customer feedback about your bouquets.</p>
      <p>Average Rating: {{ averageRating }}/5 ⭐</p>
    </div>

    <div class="comments-page">
      <div v-if="reviews.length">
        <div class="comment-card" v-for="review in reviews" :key="review.id">
          <h3>{{ review.name }}</h3>

          <p class="stars">
            {{ "⭐".repeat(review.rating) }}
          </p>

          <p>{{ review.comment || "No comment text." }}</p>
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
