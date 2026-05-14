<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  sortBy: {
    type: String,
    required: true,
  },
});

const chartData = computed(() => {
  return {
    labels: props.products.map((product) => product.bouquetName),
    datasets: [
        {
            label: props.sortBy === "revenue" ? "Revenue in €" : "Sold quantity",
            data: props.products.map((product) =>
            props.sortBy === "revenue"
                ? Number(product.totalRevenue)
                : Number(product.totalSold)
            ),
            backgroundColor: "rgba(140, 93, 203, 0.35)",
            borderColor: "rgba(140, 93, 203, 0.9)",
            hoverBackgroundColor: "rgba(140, 93, 203, 0.55)",
            borderRadius: 12,
            borderWidth: 1,
        },
        ]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            if (props.sortBy === "revenue") {
              return new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(context.raw);
            }

            return `${context.raw} sold`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
});
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 360px;
}
</style>