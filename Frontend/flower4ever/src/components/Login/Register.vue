<template>
  <div class="register-container">

    <!-- ROLE SELECTION -->
    <div
      v-if="!selectedRole"
      class="register role-select"
    >
      <h2>Please choose your account type:</h2>
      <button class="main-btn" @click="selectedRole = 'CUSTOMER'">Private</button>
      <button class="main-btn" @click="selectedRole = 'OWNER'">Business</button>
    </div>

    <!-- CUSTOMER REGISTRATION -->
    <div v-if="selectedRole === 'CUSTOMER'" class="register">
      <h1>Create Account</h1>
      <h3>Join our blooming community</h3>

      <form @submit.prevent="registerCustomer">
        <label>Username</label>
        <input v-model="customer.username" required />

        <label>Email</label>
        <input type="email" v-model="customer.email" required />

        <label>Password</label>
        <input type="password" v-model="customer.password" required />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>

        <p class="register-text">
          Already have an account?
          <router-link to="/Login">Back to Login</router-link>
        </p>
      </form>
    </div>

    <!-- OWNER REGISTRATION -->
    <div v-if="selectedRole === 'OWNER'" class="register">
      <h1>Create Business Account</h1>

      <form @submit.prevent="registerOwner">
        <label>Username</label>
        <input v-model="owner.username" required />

        <label>Email</label>
        <input type="email" v-model="owner.email" required />

        <label>Password</label>
        <input type="password" v-model="owner.password" required />

        <label>Shop Name</label>
        <input v-model="owner.shopName" />

        <label>Shop Address</label>
        <input v-model="owner.shopAddress" />

        <label>What do you offer?</label>
        <textarea v-model="owner.offer"></textarea>

        <label>Certificate</label>
        <input type="file" @change="handleFileUpload($event, 'certificate')" />

        <label>Opening Hours</label>
        <input v-model="owner.hours" />

        <label>Phone</label>
        <input v-model="owner.phone" />

        <label>Website / Social</label>
        <input v-model="owner.social" />

        <label>Shop Type</label>
        <select v-model="owner.type">
          <option value="">Select</option>
          <option value="bouquet">Bouquet</option>
          <option value="wedding">Wedding</option>
          <option value="event">Event</option>
          <option value="garden">Garden</option>
          <option value="houseplants">Houseplants</option>
          <option value="mixed">Mixed</option>
        </select>

        <label>Delivery</label>
        <select v-model="owner.delivery">
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
          <option value="both">Both</option>
        </select>

        <label>Logo</label>
        <input type="file" @change="handleFileUpload($event, 'logo')" />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register Business' }}
        </button>

        <p class="register-text">
          Already have an account?
          <router-link to="/Login">Back to Login</router-link>
        </p>
      </form>
    </div>

  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/userStore'
import router from '@/router/router'

export default {
  setup() {
    const userStore = useUserStore()
    const selectedRole = ref(null)
    const loading = ref(false)

    const customer = reactive({
      username: '',
      email: '',
      password: ''
    })

    const owner = reactive({
      username: '',
      email: '',
      password: '',
      shopName: '',
      shopAddress: '',
      offer: '',
      certificate: null,
      hours: '',
      phone: '',
      social: '',
      type: '',
      delivery: '',
      logo: null
    })

    const handleFileUpload = (e, field) => {
      owner[field] = e.target.files[0]
    }

    const registerCustomer = async () => {
      loading.value = true
      try {
        const res = await fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: customer.username,
            email: customer.email,
            password: customer.password,
            role: 'CUSTOMER'
          })
        })

        if (!res.ok) throw new Error()

        alert('Registration successful, please login')
        router.push('/Login')
      } catch {
        alert('Registration failed')
      } finally {
        loading.value = false
      }
    }

    const registerOwner = async () => {
      loading.value = true
      try {
        const res = await fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...owner,
            role: 'OWNER'
          })
        })

        if (!res.ok) throw new Error()

        alert('Owner registered, please login')
        router.push('/Login')
      } catch {
        alert('Owner registration failed')
      } finally {
        loading.value = false
      }
    }


    return {
      selectedRole,
      customer,
      owner,
      loading,
      handleFileUpload,
      registerCustomer,
      registerOwner
    }
  }
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #333333;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  width: 400px;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.input-group {
  margin-top: 20px;
}

label {
  display: block;
  text-align: left;
  margin: 10px 0 5px;
  color: #4b3c8a;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cccccc;
  outline: none;
  transition: border 0.3s;
  margin-bottom: 15px;
}

input:focus {
  border-color: #b79bd3;
}

button {
  width: 100%;
  background-color: #b79bd3;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #9f7cc1;
}

.register-text {
  margin-top: 15px;
  font-size: 14px;
  color: #4b3c8a;
}

.register-text a {
  color: #9f7cc1;
  text-decoration: none;
  font-weight: 500;
}

.register-text a:hover {
  text-decoration: underline;
}

</style>
