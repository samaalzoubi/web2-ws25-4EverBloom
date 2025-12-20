import { createRouter, createWebHashHistory } from "vue-router";
import Login from '../components/Login/Login.vue';
import Register from '../components/Login/Register.vue';
import OwnerProfile from "@/components/Profile/OwnerProfile.vue";
import UserProfile from "@/components/Profile/UserProfile.vue";
import OwnerAccount from "@/components/Profile/OwnerAccount.vue";

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/ownerProfile',
    component: OwnerProfile
  },  
  {
    path: '/userProfile',
    component: UserProfile
  },
   {
    path: '/ownerAccount',
    component: OwnerAccount
  },
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
