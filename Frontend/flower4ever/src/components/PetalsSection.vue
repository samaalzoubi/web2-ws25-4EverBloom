<script setup></script>

<template>
  <section v-if="isCustomer" class="petals-of-happiness">
    <h3>
      <slot name="title">Petals of Happiness</slot>
    </h3>

    <ul class="flower-suggestions">
      <slot></slot>
    </ul>
  </section>
</template>

<script>
import { useUserStore } from "@/stores/userStore";

export default {
  setup() {
    const userStore = useUserStore();

    return { userStore };
  },

  data() {
    return {
      isOpen: false,
    };
  },

  computed: {
    isOwner() {
      return this.userStore.user?.role === "OWNER";
    },
    isCustomer() {
      return this.userStore.user?.role === "CUSTOMER";
    },
  },
};
</script>

<style scoped>
.petals-of-happiness {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  overflow: hidden;
  margin-top: 80px;
}

.petals-of-happiness h3 {
  font-size: 1.8rem;
  font-weight: 450;
  letter-spacing: 0.06rem;
  color: rgb(51, 51, 51);
  margin-bottom: 1.5rem;
  position: relative;
}

.petals-of-happiness h3::after {
  content: "";
  display: block;
  width: 100px;
  height: 3px;
  margin: 0.6rem auto 0;
  background: var(--color-accent-light);
  border-radius: 3px;
  opacity: 0.7;
}

.flower-suggestions {
  display: grid;
  list-style: none;
  gap: 50px 48px;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  margin: 0;
  padding: 0;
  align-items: start;
  max-width: 1100px;
  width: 100%;
  justify-items: center;
}
</style>
