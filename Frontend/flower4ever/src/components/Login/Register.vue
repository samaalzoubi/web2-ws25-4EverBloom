<template>
  <div class="register-container">
    <div v-if="!selectedRole" class="register role-select">
      <h2>Please choose your account type:</h2>
      <button class="main-btn" @click="selectedRole = 'CUSTOMER'">
        Private
      </button>
      <button class="main-btn" @click="selectedRole = 'OWNER'">Business</button>
    </div>

    <div v-if="selectedRole === 'CUSTOMER'" class="register">
      <h1>Create Account</h1>
      <p>Join our blooming community</p>

      <form @submit.prevent="registerCustomer">
        <label>Username</label>
        <input v-model="customer.username" required />

        <label>Email</label>
        <input type="email" v-model="customer.email" required />

        <label>Password</label>
        <input type="password" v-model="customer.password" required />

        <div
          class="form-message"
          :class="[formMessage ? 'show' : '', formMessageType]"
        >
          {{ formMessage }}
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Creating account..." : "Register" }}
        </button>

        <p class="register-text">
          Already have an account?
          <router-link to="/Login">Back to Login</router-link>
        </p>
      </form>
    </div>

    <div v-if="selectedRole === 'OWNER'" class="register">
      <h1>Create Business Account</h1>
      <p class="subtitle">Register your flower business</p>

      <form @submit.prevent="registerOwner">
        <label>Username</label>
        <input v-model="owner.username" required />

        <label>Email</label>
        <input type="email" v-model="owner.email" required />

        <label>Password</label>
        <input type="password" v-model="owner.password" required />

        <label>Shop Name</label>
        <input v-model="owner.shopName" />

        <label>What do you offer?</label>
        <textarea v-model="owner.offer"></textarea>

        <label>Certificate</label>
        <input type="file" @change="handleFileUpload($event, 'certificate')" />

        <label>Opening Hours</label>

        <div v-if="owner">
          <input type="time" v-model="owner.openingTime" />
          <span>–</span>
          <input type="time" v-model="owner.closingTime" />
        </div>

        <label>Phone</label>
        <input v-model="owner.phone" />

        <label>Website / Social</label>
        <input v-model="owner.social" />

        <label>Shop Type</label>
        <select v-model="owner.type">
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

        <div
          class="form-message"
          :class="[formMessage ? 'show' : '', formMessageType]"
        >
          {{ formMessage }}
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Creating account..." : "Register Business" }}
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
import { ref, reactive } from "vue";
import router from "@/router/router";

export default {
  setup() {
    const selectedRole = ref(null);
    const loading = ref(false);
    const formMessage = ref("");
    const formMessageType = ref("");

    const customer = reactive({
      username: "",
      email: "",
      password: "",
    });

    const owner = reactive({
      username: "",
      email: "",
      password: "",
      shopName: "",
      shopAddress: "",
      offer: "",
      certificate: null,
      openingTime: "",
      closingTime: "",
      phone: "",
      social: "",
      type: "",
      delivery: "",
      logo: null,
    });

    const handleFileUpload = (e, field) => {
      owner[field] = e.target.files[0];
    };

    const registerCustomer = async () => {
      loading.value = true;
      formMessage.value = "";

      try {
        const res = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: customer.username,
            email: customer.email,
            password: customer.password,
            role: "CUSTOMER",
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          formMessage.value = text;
          formMessageType.value = "error";
          return;
        }

        formMessage.value = "Account created successfully";
        formMessageType.value = "success";
        setTimeout(() => router.push("/Login"), 1500);
      } catch {
        formMessage.value = "Server not reachable";
        formMessageType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    const registerOwner = async () => {
      loading.value = true;
      formMessage.value = "";

      try {
        const res = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: owner.username,
            email: owner.email,
            password: owner.password,
            role: "OWNER",
            shopName: owner.shopName,
            openingTime: owner.openingTime,
            closingTime: owner.closingTime,
          }),
        });

        if (!res.ok) {
          formMessage.value = "Business registration failed";
          formMessageType.value = "error";
          return;
        }

        formMessage.value = "Business account created";
        formMessageType.value = "success";
        setTimeout(() => router.push("/Login"), 1500);
      } catch {
        formMessage.value = "Server not reachable";
        formMessageType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    return {
      selectedRole,
      customer,
      owner,
      loading,
      formMessage,
      formMessageType,
      handleFileUpload,
      registerCustomer,
      registerOwner,
    };
  },
};
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

.form-message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;

  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease;
}

.form-message.show {
  opacity: 1;
  visibility: visible;
}

.form-message.success {
  background-color: #e8f7ef;
  color: #1e7f4f;
  border: 1px solid #b7e4cd;
}

.form-message.error {
  background-color: #fdecea;
  color: #b42318;
  border: 1px solid #f5c2bd;
}

select {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}

select::selection {
  width: 100%;
  padding: 12px 44px 12px 14px;
  font-size: 14px;
  font-family: inherit;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

select::after {
  content: "expand_more";
  font-family: "Material Symbols Outlined";
  font-size: 22px;
  color: #777;
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  pointer-events: none;
}

select:hover {
  border-color: #c7a6d8;
}

select:focus {
  outline: none;
  border-color: #c7a6d8;
  box-shadow: 0 0 0 3px rgba(199, 166, 216, 0.25);
}

select option[value=""] {
  color: #aaa;
}

textarea {
  width: 100%;
  min-height: 90px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
  resize: vertical;
}

placeholder {
  color: #aaa;
}

textarea:focus {
  outline: none;
  border-color: #c7a6d8;
  box-shadow: 0 0 0 3px rgba(199, 166, 216, 0.25);
}

.time-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-range input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.time-range span {
  font-size: 18px;
  font-weight: 600;
  color: #7e4bb1;
}
</style>
