<template>
  <div>
    <OwnerHeader v-if="user.role === 'owner'" />
    <Header v-else/>

    <router-view />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Header from './components/Header/Header.vue';
import OwnerHeader from './components/Header/OwnerHeader.vue';
import Footer from './components/Footer/Footer.vue';

//TODO: userStore erstellen und da userId, user-Rolle und isLoggedIn speichern
const user = ref({
  role: 'customer'
});

//TODO: wenn Login funktioniert, beide Zeilen weg machen
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("userId", 2);

//const userStore = useUserStore()
//onMounted(() => userStore.fetchUser())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

:root {
  /* Colors */
  --color-header-background: rgba(255, 255, 255, 0.7);
  --color-background: #ffffff;
  --color-background-secondary: #d4bdf0;
  --color-text-dark: #333333;
  --color-hover: #b79bd3;
  --color-box-shadows: rgba(0, 0, 0, 0.05);

  /* Accent & Text Colors */
  --color-accent-dark: #4b3c8a;
  --color-accent-light: #7e4bb1;
  --color-accent-hover: #5b2e91;
  --color-subtitle: #666666;
  --color-border: #cccccc;
  --color-footer-bg: rgba(255, 255, 255, 0.6);
  --color-footer-text: #666666;
  --color-toggle-text: #555555;
  --color-btn-hover: #9f7cc1;
}

/* Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background: linear-gradient(120deg, var(--color-background), var(--color-background-secondary));
  color: var(--color-text-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main */
main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.form-container {
  background-color: var(--color-background);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px var(--color-box-shadows);
  width: 400px;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.hidden {
  display: none;
}

h2 {
  color: var(--color-accent-dark);
  margin-bottom: 10px;
}

.subtitle {
  color: var(--color-subtitle);
  margin-bottom: 25px;
  font-size: 15px;
}

label {
  display: block;
  text-align: left;
  margin: 10px 0 5px;
  color: var(--color-accent-dark);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  outline: none;
  transition: border 0.3s;
}

input:focus {
  border-color: var(--color-hover);
}

.main-btn {
  width: 100%;
  background-color: var(--color-hover);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.main-btn:hover {
  background-color: var(--color-btn-hover);
}

.toggle-text {
  margin-top: 20px;
  color: var(--color-toggle-text);
  font-size: 14px;
}

.toggle-text span {
  color: var(--color-accent-light);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;
}

.toggle-text span:hover {
  color: var(--color-accent-hover);
}

/* Footer */
footer {
  text-align: center;
  padding: 20px;
  background-color: var(--color-footer-bg);
  font-size: 14px;
  color: var(--color-footer-text);
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(10px);}
  to {opacity: 1; transform: translateY(0);}
}

/* Responsive */
@media (max-width: 600px) {
  header {
    flex-direction: column;
    padding: 10px 20px;
  }

  nav {
    margin-top: 10px;
  }

  .form-container {
    width: 90%;
  }
}
</style>
