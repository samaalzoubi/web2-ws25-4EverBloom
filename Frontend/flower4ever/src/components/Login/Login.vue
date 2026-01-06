<template>
  <div class="login-container">
    <form @submit.prevent="logIn" class="login">
      <h1>Welcome</h1>
      <h3>Log in to explore our floral collections</h3>

      <div class="input-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          placeholder="example@gmail.com"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          placeholder="Password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p class="register-text">
        No account yet?
        <router-link to="/Register">Register here</router-link>
      </p>
    </form>
  </div>
</template>


<script>
import { useUserStore } from '@/stores/userStore'
import router from '@/router/router'

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async logIn() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:8080/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })

        if (!res.ok) throw new Error()

        const userData = await res.json()

        const userStore = useUserStore()
        userStore.login(userData)

        // Redirect nach Rolle
        if (userData.role === 'OWNER') {
          router.push('/owner/dashboard')
        } else {
          router.push('/')
        }
      } catch {
        alert('Login fehlgeschlagen')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #333333;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
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
