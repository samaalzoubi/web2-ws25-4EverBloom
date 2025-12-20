<template>
  <div class="register-container">
    <div
      v-if="!selectedRole"
      class="register"
      style="text-align:center; padding:30px; border-radius:20px; background:white; max-width:450px; margin:120px auto; box-shadow:0 5px 20px rgba(0,0,0,0.1);"
    >
      <h2 style="margin-bottom:20px; font-size:20px; font-weight:600;">
        Please choose your account type:
      </h2>
      <button class="main-btn" @click="selectedRole = 'user'">Private</button>
      <button class="main-btn" @click="selectedRole = 'owner'">Business</button>
    </div>

    <!-- Private User Registrierung -->
    <div v-if="selectedRole === 'user'" class="register">
      <h1>Create Account</h1>
      <h3>Join our blooming community</h3>
      <form @submit.prevent="registerUser">
        <label>Username</label>
        <input type="text" v-model="user.username" placeholder="Choose a username" required />

        <label>Email</label>
        <input type="email" v-model="user.email" placeholder="example@gmail.com" required />

        <label>Password</label>
        <input type="password" v-model="user.password" placeholder="Create password" required />

        <button type="submit" @click="registerUser()">Register</button>

        <p class="register-text">
          Already have an account?
          <router-link to="/Login">Back to Login</router-link>
        </p>
      </form>
    </div>

    <!-- Business Owner Registrierung -->
    <div v-if="selectedRole === 'owner'" class="register">
      <h1>Create Business Account</h1>
      <form @submit.prevent="registerOwner">
        <label>Username</label>
        <input type="text" v-model="owner.username" placeholder="Choose a username" required />

        <label>Email</label>
        <input type="email" v-model="owner.email" placeholder="example@gmail.com" required />

        <label>Password</label>
        <input type="password" v-model="owner.password" placeholder="Create password" required />

        <!-- Business Felder -->
        <div id="business-fields">
          <label>Shop Name</label>
          <input type="text" v-model="owner.shopName" placeholder="Your shop name" />

          <label>Shop Address</label>
          <input type="text" v-model="owner.shopAddress" placeholder="Street, City, ZIP" />

          <label>What do you offer?</label>
          <textarea v-model="owner.offer" placeholder="Describe your services or products" style="height:80px;"></textarea>

          <label>Upload Certificate</label>
          <input type="file" @change="handleFileUpload($event, 'certificate')" accept="image/*,application/pdf" />

          <label>Opening Hours</label>
          <input type="text" v-model="owner.hours" placeholder="e.g. Mon–Fri: 09:00–18:00" />

          <label>Phone Number</label>
          <input type="text" v-model="owner.phone" placeholder="Contact number" />

          <label>Website / Social Media</label>
          <input type="text" v-model="owner.social" placeholder="Website or Instagram page" />

          <label>Flower Shop Type</label>
          <select v-model="owner.type">
            <option value="">Select type</option>
            <option value="bouquet">Bouquet Shop</option>
            <option value="wedding">Wedding Flowers</option>
            <option value="event">Event Decoration</option>
            <option value="garden">Garden Plants</option>
            <option value="houseplants">Houseplants</option>
            <option value="mixed">Mixed Flower Shop</option>
            <option value="other">Other</option>
          </select>

          <label>Delivery Options</label>
          <select v-model="owner.delivery">
            <option value="pickup">Pickup Only</option>
            <option value="delivery">Delivery Available</option>
            <option value="both">Pickup & Delivery</option>
          </select>

          <label>Logo Upload</label>
          <input type="file" @change="handleFileUpload($event, 'logo')" accept="image/*" />
        </div>

        <button type="submit" @click="registerOwner()">Register</button>
        <p class="register-text">
          Already have an account?
          <router-link to="/Login">Back to Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    const selectedRole = ref(null);

    const user = reactive({
      username: '',
      email: '',
      password: ''
    });

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
    });

    const handleFileUpload = (event, field) => {
      if (event.target.files.length > 0) {
        owner[field] = event.target.files[0];
      }
    };

    const registerUser = () => {
      console.log('User data:', user);
      // Hier API Call für User-Registrierung
    };

    const registerOwner = () => {
      console.log('Owner data:', owner);
      // Hier API Call für Owner-Registrierung
    };

    return { selectedRole, user, owner, handleFileUpload, registerUser, registerOwner };
  }
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

</style>
