<template>
  <div>
    <Header v-if="user.role === 'CUSTOMER'" />
    <OwnerHeader v-else-if="user.role === 'OWNER'" />

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
  role: 'OWNER'
});

onMounted(async () => {
  try {
    // Get current user - you should replace '1' with actual user ID from auth/session
    const userId = localStorage.getItem('userId') || 2;
    const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`);
    
    if (response.ok) {
      const userData = await response.json();
      user.value = userData;
      console.log('User loaded:', userData); // Debug log
    } else {
      // Default to owner role if user not found
      console.warn('User not found, using default role');
      user.value = { role: 'OWNER' };
    }
  } catch (error) {
    console.error('User konnte nicht geladen werden', error);
    // Fallback to default role
    user.value = { role: 'OWNER' };
  }
});
</script>
