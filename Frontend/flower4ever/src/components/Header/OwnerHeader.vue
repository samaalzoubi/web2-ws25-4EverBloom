<template>
  <div>
  <header>
    <router-link to="/flower4ever/src/components/CustomerShopView/" class="logo">
      <img src="@/assets/Logo.png" alt="Flower Logo" width="70" height="70" />
     </router-link>
     <div>
        <h1 class="material-symbols-outlined">BLÜMEO</h1>
        <h3>Design. Bloom. Inspire</h3>
      </div>
   
    <nav>
      <router-link to="" class="design-bouquet">
        <span class="fx-3d">3D </span> esign Bouquet 🪄
      </router-link>

      <div class="user-menu" @click="toggleMenu">
        <i class="fa fa-user-circle-o sfa-4x;" style="transform: scale(1.3);" aria-hidden="true"></i>
        
        <div v-if="isOpen" class="dropdown-menu">
          <div class="dropdown-item">
            <router-link 
                to="/ownerProfile" 
                class="fa fa-user-o"   
                @click.stop>View Profile
              </router-link>
          </div>

          <div class="dropdown-item">
            <router-link 
                to="/ownerAccount" 
                class="fa fa-shopping-bag"   
                @click.stop>Account
            </router-link>
          </div>

          <div class="dropdown-item">
            <router-link 
                to="/login" 
                class="fa fa-sign-out"   
                @click.stop>Logout
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
    </div>
</template>


<script>
  import router from '@/router/router';

export default {
  name: "HeaderComponent",
  data() {
    return {
      isOpen: false,
      cartCount: 0, 
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    //Hier muss noch die Links hinzugefügt werden
    nagivateTo(route) {
      if (route === "orders") {
        this.$router.push("/ownerProfile");
      } else if (route === "profile") {
        this.$router.push("/ownerAccount");
      } else if (route === "logout") {
        this.$router.push("/login");
      }
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
*{
  margin: 0;
  font-family: 'Poppins';
}

div h1{
  padding-top: 14px;
  padding-left: 28px;
  font-size: 32px;
  color: #7e4bb1;
  font-weight: 1200;
}

div h3{
  font-size: 18px;
  padding-left: 28px;
  padding-top: 10px;
  color: #7e4bb1; 
  font-weight: 1200;
}

header {
  display: flex;
  width: 100%;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

img {
  align-items: center;
  padding-top: 10px;
  text-decoration: none;
  padding-left: 20px;
}

nav {
 margin-left: auto;   /* DAS schiebt die Nav ganz nach rechts */
 display: flex;
 align-items: center;
 gap: 22px;
 padding-right: 30px;
}

nav a {
  text-decoration: none;
  color: #4b3c8a;
  font-weight: 500;
  transition: color 0.3s;
  display: inline-flex;
}

nav i:hover{
  color: #b79bd3;
}

.design-bouquet {
  border: 3px solid transparent;
  border-radius: 1em;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to left,  #7e4bb1, rgb(241, 194, 236)) border-box;
  padding: 6px 12px;
}

.design-bouquet:hover {
  background: linear-gradient( #d4bdf0,  #d4bdf0) padding-box,
              linear-gradient(to left,  #7e4bb1, rgb(241, 194, 236)) border-box;
}

.fx-3d {
  font-weight: 400;
  letter-spacing: .05em;
  background: linear-gradient(180deg, #fff, #f7f1ff 90%, #d2c6ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow:
    1px 1px 0 #7265b3,
    2px 2px 0 #4735a3,
    3px 3px 0 #8985a6;
}

.cart-link {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: 0;
  color: #4b3c8a;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 50%;
  padding: 1px 3px;
  min-width: 17px;
  text-align: center;
  pointer-events: none;
  transform: translateX(13px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
  cursor: pointer;
  color: #4b3c8a;
}

.dropdown-menu {
  position: absolute;
  top: 150%;
  right: 0;
  color: black;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 180px;
  display: flex;
  flex-direction: column; /* Wichtig: vertikal */
  padding: 10px 0;
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 10px; /* Abstand zwischen Icon und Text */
  cursor: pointer;
  transition: background 0.2s;
  justify-content: space-between;
}

.dropdown-item:hover {
  background-color: #d4bdf0;
  color: white;
}
</style>