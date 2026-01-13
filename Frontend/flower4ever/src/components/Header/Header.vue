<template>
  <header class="main-header">
    <router-link :to="homeLink" class="logo-container">
      <img src="@/assets/Logo.png" alt="Flower Logo" width="70" height="70" />
      <div class="logo-text">
        <h1>BLÜMEO</h1>
        <h3>Design. Bloom. Inspire</h3>
      </div>
    </router-link>

    <nav>
      <router-link v-if="!userStore.isLoggedIn" to="/login">
        <i class="fas fa-sign-in-alt"></i>
        <span style="margin-left: 6px">Login</span>
      </router-link>

      <template v-else>
        <router-link v-if="isCustomer" to="#" class="design-bouquet">
          <span class="fx-3d">3D</span>esign Bouquet 🪄
        </router-link>

        <a
          v-if="isCustomer && route.name !== 'checkout'"
          class="cart-link"
          href="#"
          title="Cart"
          @click.prevent="onCartClick"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
          <span class="cart-count">{{ cartStore.totalQuantity }}</span>
        </a>

        <template v-if="isOwner && !isOnOwnerHome">
          <div class="shop-view-text">
            <router-link to="/shop-owner-home" @click.stop>
              <i></i> Shop view
            </router-link>
          </div>
        </template>

        <div class="user-menu" @click="toggleMenu">
          <i class="far fa-user-circle"></i>

          <div v-if="isOpen" class="dropdown-menu">
            <template v-if="isCustomer">
              <div class="dropdown-item">
                <router-link to="/customer-orders" @click.stop>
                  <i class="fas fa-shopping-bag"></i> My Orders
                </router-link>
              </div>

              <div class="dropdown-item">
                <router-link to="/customerProfileEdit" @click.stop>
                  <i class="fas fa-user"></i> Account
                </router-link>
              </div>
            </template>

            <template v-if="isOwner">
              <div class="dropdown-item">
                <router-link to="/ownerProfileEdit" @click.stop>
                  <i class="fas fa-user"></i> Account
                </router-link>
              </div>
            </template>

            <div class="dropdown-item">
              <a href="#" @click.stop.prevent="logout">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </div>
        </div>
      </template>
    </nav>
    <CartSidebar v-if="isCustomer && route.name !== 'checkout'" />
  </header>
</template>

<script>
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { useRoute, useRouter } from "vue-router";
import CartSidebar from "@/components/CartSidebar.vue";

export default {
  components: { CartSidebar },

  setup() {
    const cartStore = useCartStore();
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();

    return { cartStore, userStore, route, router };
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
    isOnOwnerHome() {
      return this.$route.path === "/shop-owner-home";
    },
  },

  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },

    homeLink() {
      if (this.isOwner) return "/shop-owner-home";
      return "/";
    },

    onCartClick(event) {
      event.preventDefault();
      this.cartStore.toggle();
    },

    logout() {
      this.userStore.logout();
      this.isOpen = false;
      this.router.push("/login");
    },
  },

  watch: {
    "route.fullPath"() {
      this.isOpen = false;
    },
  },
};
</script>

<style>
.main-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  min-height: 100px !important;
  height: auto !important;
  background-color: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  padding: 20px 30px !important;
  box-sizing: border-box !important;
  position: relative !important;
  z-index: 9999 !important;
  margin: 0 !important;
}

.main-header * {
  box-sizing: border-box !important;
}

.logo-container {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  text-decoration: none !important;
  min-height: 70px !important;
}

.logo-container img {
  padding: 0 !important;
  display: block !important;
  width: 70px !important;
  height: 70px !important;
  flex-shrink: 0 !important;
}

.logo-text {
  display: block !important;
  min-width: 200px !important;
}

.logo-text h1 {
  padding: 0 !important;
  font-size: 32px !important;
  color: #7e4bb1 !important;
  font-weight: 700 !important;
  margin: 0 0 5px 0 !important;
  line-height: 1.2 !important;
  display: block !important;
}

.logo-text h3 {
  font-size: 14px !important;
  padding: 0 !important;
  margin: 0 !important;
  color: #7e4bb1 !important;
  font-weight: 400 !important;
  line-height: 1.2 !important;
  display: block !important;
}

nav {
  display: flex !important;
  align-items: center !important;
  gap: 25px !important;
  min-height: 50px !important;
}

nav a {
  text-decoration: none;
  color: #4b3c8a;
  font-weight: 500;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
}

nav i {
  font-size: 24px;
  color: #4b3c8a;
  transition: color 0.3s;
}

nav i:hover {
  color: #b79bd3;
}

.design-bouquet {
  border: 3px solid transparent;
  border-radius: 1em;
  background: linear-gradient(white, white) padding-box,
    linear-gradient(to left, #7e4bb1, rgb(241, 194, 236)) border-box;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 600;
}

.design-bouquet:hover {
  background: linear-gradient(#d4bdf0, #d4bdf0) padding-box,
    linear-gradient(to left, #7e4bb1, rgb(241, 194, 236)) border-box;
}

.fx-3d {
  font-weight: 700;
  letter-spacing: 0.05em;
  background: linear-gradient(180deg, #fff, #f7f1ff 90%, #d2c6ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 0 #7265b3, 2px 2px 0 #4735a3, 3px 3px 0 #8985a6;
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #7e4bb1;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
  pointer-events: none;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-menu i {
  font-size: 28px;
}

.user-menu i {
  color: #4b3c8a;
  font-size: 23px;
}

.shop-view-text {
  color: #4b3c8a;
  margin-top: -7px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  z-index: 1000;
}

.dropdown-item {
  transition: background 0.2s;
  color: #4b3c8a;
}

.dropdown-item a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
}

.dropdown-item:hover {
  background-color: #f5f0ff;
  color: #7e4bb1;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
}

.dropdown-item span {
  font-size: 14px;
  font-weight: 500;
}
</style>
