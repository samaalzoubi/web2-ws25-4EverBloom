<template>
  <main class="dashboard-container">
    <section class="dashboard-topbar">
        <div class="topbar-content">
            <div>
                <p class="eyebrow">Shop analytics</p>
                <h1>Dashboard</h1>
                <p class="hero-text">
                    Track your best-performing bouquets by sales quantity and generated revenue
                </p>
            </div>
        </div>
    </section>

    <section class="filter-panel">
        <div class="filter-header">
            <div>
                <h2>Product performance</h2>
                <p>Filter the ranking by analysis type and order date</p>
            </div>

            <button class="reset-button" @click="resetFilters">
                <span class="material-symbols-outlined">restart_alt</span>
                Reset
            </button>
        </div>

        <div class="filter-grid">
            <div class="control-group control-wide">
                <label for="sortBy">Analysis type</label>
                <div class="select-wrapper">
                    <select id="sortBy" v-model="sortBy" @change="loadTopProducts">
                        <option value="quantity">Top products by quantity</option>
                        <option value="revenue">Top products by revenue</option>
                    </select>
                </div>
            </div>

            <div class="control-group">
            <label for="startDate">Start date</label>
            <input
                id="startDate"
                v-model="startDate"
                type="date"
                @change="loadTopProducts"
            />
            </div>

            <div class="control-group">
            <label for="endDate">End date</label>
            <input
                id="endDate"
                v-model="endDate"
                type="date"
                @change="loadTopProducts"
            />
            </div>
        </div>
        </section>

    <section class="dashboard-grid">
      <article class="stat-card">
        <div class="stat-icon">
          <span class="material-symbols-outlined">leaderboard</span>
        </div>
        <div>
          <span class="stat-label">Displayed products</span>
          <strong>{{ topProducts.length }}</strong>
          <p>Top 3 bouquets</p>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">
          <span class="material-symbols-outlined">analytics</span>
        </div>
        <div>
          <span class="stat-label">Analysis mode</span>
          <strong>{{ sortByLabel }}</strong>
          <p>{{ activePeriodLabel }}</p>
        </div>
      </article>
    </section>

    <section class="dashboard-card chart-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">Performance overview</p>
          <h2>{{ chartTitle }}</h2>
          <p>{{ chartSubtitle }}</p>
        </div>
      </div>

      <div v-if="loading" class="state-message">
        Loading dashboard data...
      </div>

      <div v-else-if="errorMessage" class="state-message error">
        {{ errorMessage }}
      </div>

      <div v-else-if="topProducts.length === 0" class="state-message">
        No product sales found for the selected period.
      </div>

      <TopProductsChart
        v-else
        :products="topProducts"
        :sort-by="sortBy"
      />
    </section>

    <section v-if="topProducts.length > 0" class="dashboard-card table-card">
      <div class="card-header table-header">
        <div>
          <p class="eyebrow">Detailed results</p>
          <h2>Top products details</h2>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold quantity</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="product in topProducts" :key="product.bouquetId">
              <td>
                <strong>{{ product.bouquetName }}</strong>
              </td>
              <td>{{ product.totalSold }}</td>
              <td>{{ formatCurrency(product.totalRevenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchTopProducts } from "@/services/dashboardService";
import TopProductsChart from "@/components/Profile/TopProductsChart.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const shopId = Number(route.query.shopId) || JSON.parse(localStorage.getItem("user"))?.id || 1;

const sortBy = ref("quantity");
const startDate = ref("");
const endDate = ref("");

const topProducts = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const sortByLabel = computed(() => {
    return sortBy.value === "revenue" ? "Revenue" : "Quantity";
});

const chartTitle = computed(() => {
    return sortBy.value === "revenue"
        ? "Top products by revenue"
        : "Top products by quantity";
});

const chartSubtitle = computed(() => {
    return sortBy.value === "revenue"
        ? "Products that generated the highest revenue in the selected period"
        : "Products that were sold most often in the selected period";
});

const activePeriodLabel = computed(() => {
    if (!startDate.value && !endDate.value) {
        return "Complete period";
    }

    if (startDate.value && endDate.value) {
        return `${startDate.value} to ${endDate.value}`;
    }

    if (startDate.value) {
        return `From ${startDate.value}`;
    }

    return `Until ${endDate.value}`;
});

async function loadTopProducts() {
    loading.value = true;
    errorMessage.value = "";

    try {
        topProducts.value = await fetchTopProducts({
        shopId,
        sortBy: sortBy.value || "quantity",
        startDate: startDate.value || null,
        endDate: endDate.value || null
        });
    } catch (error) {
        errorMessage.value = error.message;
        topProducts.value = [];
    } finally {
        loading.value = false;
    }
}

function resetFilters() {
    startDate.value = "";
    endDate.value = "";
    sortBy.value = "quantity";
    loadTopProducts();
}

function formatCurrency(value) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}

onMounted(() => {
    loadTopProducts();
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  padding: 8rem 4rem 5rem;
  color: var(--color-text-dark);
}

.dashboard-topbar {
  width: 100%;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(250, 244, 255, 0.96));
  border: 1px solid rgba(216, 196, 242, 0.75);
  box-shadow: 0 14px 36px rgba(95, 61, 150, 0.1);
  overflow: hidden;
}

.dashboard-topbar::before {
  content: "";
  display: block;
  height: 5px;
  background: linear-gradient(to right, var(--color-accent-light), rgb(241, 194, 236));
}

.topbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 30px 34px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.09rem;
  text-transform: uppercase;
  color: var(--color-accent-light);
}

.dashboard-topbar h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-text-dark);
}

.hero-text {
  max-width: 700px;
  margin: 12px 0 0;
  line-height: 1.5;
  font-size: 16px;
  color: var(--color-text-dark);
  opacity: 0.75;
}

.filter-panel {
  width: 100%;
  padding: 24px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(216, 196, 242, 0.75);
  box-shadow: 0 12px 32px rgba(95, 61, 150, 0.09);
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.filter-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--color-text-dark);
}

.filter-header p {
  margin: 6px 0 0;
  color: var(--color-text-dark);
  opacity: 0.7;
  line-height: 1.4;
}

.filter-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1.4fr) minmax(170px, 0.8fr) minmax(170px, 0.8fr);
  gap: 18px;
  align-items: end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text-dark);
}

.control-group select,
.control-group input {
  width: 100%;
  height: 46px;
  border: 1px solid rgba(216, 196, 242, 0.95);
  border-radius: 14px;
  padding: 0 14px;
  font-size: 15px;
  color: var(--color-text-dark);
  background: #fff;
  outline: none;
  transition: all 0.25s ease;
}

.control-group select:focus,
.control-group input:focus {
  border-color: var(--color-accent-light);
  box-shadow: 0 0 0 4px rgba(140, 93, 203, 0.12);
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  border: 1px solid rgba(216, 196, 242, 0.95);
  border-radius: 999px;
  padding: 0 18px;
  background: #fff;
  color: var(--color-text-dark);
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.reset-button .material-symbols-outlined {
  font-size: 20px;
}

.reset-button:hover {
  background: var(--color-hover);
  border-color: var(--color-hover);
  color: white;
  transform: translateY(-1px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 36px rgba(95, 61, 150, 0.11);
  border: 1px solid rgba(216, 196, 242, 0.7);
}

.stat-icon {
  display: grid;
  place-items: center;
  min-width: 58px;
  height: 58px;
  border-radius: 18px;
  background: var(--color-header-background);
  color: var(--color-accent-light);
}

.stat-icon .material-symbols-outlined {
  font-size: 30px;
}

.stat-label {
  display: block;
  margin-bottom: 6px;
  color: var(--color-accent-light);
  font-weight: 800;
  font-size: 14px;
}

.stat-card strong {
  display: block;
  font-size: 32px;
  color: var(--color-text-dark);
  line-height: 1.1;
}

.stat-card p {
  margin: 6px 0 0;
  color: var(--color-text-dark);
  opacity: 0.75;
}

.dashboard-card {
  padding: 30px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(95, 61, 150, 0.12);
  border: 1px solid rgba(216, 196, 242, 0.7);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 28px;
  color: var(--color-text-dark);
}

.card-header p:not(.eyebrow) {
  margin: 8px 0 0;
  color: var(--color-text-dark);
  opacity: 0.75;
  line-height: 1.4;
}

.state-message {
  padding: 34px;
  border-radius: 20px;
  background: rgba(245, 236, 255, 0.85);
  color: var(--color-text-dark);
  text-align: center;
  font-weight: 700;
}

.state-message.error {
  background: #ffecec;
  color: #9f1c1c;
  border: 1px solid #f5c2c2;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
}

th,
td {
  padding: 17px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(216, 196, 242, 0.85);
}

th {
  color: var(--color-accent-light);
  font-size: 13px;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
}

td {
  color: var(--color-text-dark);
  font-weight: 600;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background: rgba(245, 236, 255, 0.65);
}

@media (max-width: 1000px) {
  .dashboard-container {
    padding: 7rem 2rem 4rem;
  }

  .topbar-content {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-summary {
    min-width: 0;
  }

  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }

  .control-wide {
    grid-column: span 2;
  }
}

@media (max-width: 700px) {
  .dashboard-container {
    padding: 6rem 1rem 3rem;
  }

  .topbar-content {
    padding: 26px 22px;
  }

  .filter-header {
    flex-direction: column;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .control-wide {
    grid-column: auto;
  }

  .reset-button {
    width: 100%;
    justify-content: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    align-items: flex-start;
  }

  .dashboard-card {
    padding: 22px;
  }
}
</style>