<template>
  <div>
    <Header v-if="user.role === 'user'" />
    <OwnerHeader v-else-if="user.role === 'owner'" />

    <router-view />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Header from './components/Header/Header.vue';
import OwnerHeader from './components/Header/OwnerHeader.vue';
import Footer from './components/Footer/Footer.vue';

const user = ref({
  role: 'owner'
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/user');
    user.value = await response.json();
  } catch (error) {
    console.error('User konnte nicht geladen werden', error);
  }
});
</script>
