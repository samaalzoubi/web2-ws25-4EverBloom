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

const reviews = ref([]);
const showReviewForm = ref(false);
const newRating = ref(5);
const newReview = ref("");
const eligibleOrder = ref(null);

const currentUser = JSON.parse(localStorage.getItem("user"));
const customerId = currentUser?.id;

const successMessage = ref("");

const alreadyReviewed = computed(() => {
  if (!eligibleOrder.value) return false;

  return reviews.value.some(
    (review) => Number(review.orderId) === Number(eligibleOrder.value.id),
  );
});

const averageRating = computed(() => {
  if (!reviews.value.length) return "0.0";

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);

  return (total / reviews.value.length).toFixed(1);
});

onMounted(async () => {
  try {
    shop.value = await fetchShopByIdGraphQL(shopId);
    bouquets.value = await fetchShopBouquetsGraphQL(shopId);

    await checkIfCustomerOrderedFromShop();
    await loadReviewsFromCustomerOrders();
  } catch (error) {
    console.error("Failed to load shop profile:", error);
  }
});

function handleAddToCart(bouquet) {
  cartStore.addBouquet(bouquet.id);
}

async function checkIfCustomerOrderedFromShop() {
  if (!customerId) return;

  const query = `
    query OrdersByCustomer($customerId: Int!) {
      ordersByCustomer(customerId: $customerId) {
        id
        status
        orderDate
        items {
          bouquetName
          quantity
          price
        }
      }
    }
  `;

  const response = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        customerId: Number(customerId),
      },
    }),
  });

  const result = await response.json();
  const orders = result.data?.ordersByCustomer || [];

  eligibleOrder.value = orders.find((order) => order.status === "DELIVERED");
}

async function loadReviewsFromCustomerOrders() {
  if (!customerId) return;

  const ordersQuery = `
    query OrdersByCustomer($customerId: Int!) {
      ordersByCustomer(customerId: $customerId) {
        id
        status
      }
    }
  `;

  const ordersResponse = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ordersQuery,
      variables: {
        customerId: Number(customerId),
      },
    }),
  });

  const ordersResult = await ordersResponse.json();
  const orders = ordersResult.data?.ordersByCustomer || [];

  const ratingLists = await Promise.all(
    orders.map((order) => fetchRatingsByOrder(order.id)),
  );

  reviews.value = ratingLists.flat().map((rating) => ({
    id: rating.id,
    name: currentUser?.username
      ? currentUser.username
      : `Customer #${rating.customerId}`,
    rating: rating.ratingScore,
    comment: rating.review,
    orderId: rating.orderId,
    customerId: rating.customerId,
  }));
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

async function submitNewReview() {
  if (!eligibleOrder.value || !customerId) return;

  successMessage.value = "Your review has been submitted successfully.";

  setTimeout(() => {
    successMessage.value = "";
  }, 3000);

  const mutation = `
    mutation SubmitRating($input: RatingInput!) {
      submitRating(input: $input) {
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
      query: mutation,
      variables: {
        input: {
          orderId: Number(eligibleOrder.value.id),
          customerId: Number(customerId),
          ratingScore: Number(newRating.value),
          review: newReview.value,
        },
      },
    }),
  });

  const result = await response.json();

  const savedReview = result.data?.submitRating;

  if (!savedReview) return;

  reviews.value.push({
    id: savedReview.id,
    name: "You",
    rating: savedReview.ratingScore,
    comment: savedReview.review,
    orderId: savedReview.orderId,
    customerId: savedReview.customerId,
  });

  newRating.value = 5;
  newReview.value = "";
  showReviewForm.value = false;
}
</script>

<template>
  <main>
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

    <section class="tab-section" v-if="activeTab === 'reviews'">
      <div class="reviews-header">
        <h2>Customer Reviews</h2>

        <button
          v-if="eligibleOrder"
          class="add-review-btn"
          :disabled="alreadyReviewed"
          @click="!alreadyReviewed && (showReviewForm = !showReviewForm)"
        >
          +
        </button>
      </div>
      <p v-if="alreadyReviewed" class="already-reviewed-message">
        You have already submitted a review for this order.
      </p>

      <div v-if="showReviewForm && !alreadyReviewed" class="review-form">
        <label>Rating</label>

        <select v-model="newRating">
          <option :value="5">5 ⭐</option>
          <option :value="4">4 ⭐</option>
          <option :value="3">3 ⭐</option>
          <option :value="2">2 ⭐</option>
          <option :value="1">1 ⭐</option>
        </select>

        <label>Comment</label>

        <textarea
          v-model="newReview"
          placeholder="Write your comment..."
        ></textarea>

        <button @click="submitNewReview">Submit Review</button>
      </div>

      <p v-if="!eligibleOrder" class="info-text">
        You can only add a review after ordering from this shop.
      </p>

      <div v-if="reviews.length">
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <h3>{{ review.name }}</h3>

          <p class="stars">
            {{ "⭐".repeat(review.rating) }}
          </p>

          <p>{{ review.comment || "No comment text." }}</p>
        </div>
      </div>

      <p v-else>No reviews available yet.</p>
    </section>

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
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  margin-top: 67px;
}

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

.add-review-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.7;
}

.already-reviewed-message {
  margin-top: 10px;
  color: #6b7280;
  font-size: 0.9rem;
}

.shop-details {
  min-width: 300px;
  line-height: 1.8;
  text-align: right;
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

.shop-tabs .tab {
  font-weight: 500;
  padding-bottom: 0.3rem;
  cursor: pointer;
}

.shop-tabs .tab.active {
  color: var(--color-hover);
  border-bottom: 2px solid var(--color-hover);
}

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

.tab-section {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-review-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: var(--color-hover);
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
}

.review-form {
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.review-form select,
.review-form textarea {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.review-form textarea {
  min-height: 100px;
}

.review-form button {
  align-self: flex-start;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: var(--color-hover);
  color: white;
  cursor: pointer;
}

.info-text {
  color: #777;
  margin-bottom: 1rem;
}

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
