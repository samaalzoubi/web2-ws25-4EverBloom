import { createRouter, createWebHashHistory } from "vue-router";
import Login from '../components/Login/Login.vue';
import Register from '../components/Login/Register.vue';
import OwnerProfile from "@/components/Profile/OwnerProfile.vue";
import UserProfile from "@/components/Profile/UserProfile.vue";
import OwnerAccount from "@/components/Profile/OwnerAccount.vue";
import CustomerOrders from "@/components/Order/CustomerOrders.vue";
import AdminOrders from "@/components/Order/AdminOrders.vue";
import HomePage from "@/views/customer-views/HomePage.vue";
import Map from "@/views/customer-views/Map.vue";
import Checkout from "@/views/customer-views/Checkout.vue";

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
  {
    path: '/customer-orders',
    name: 'CustomerOrders',
    component: CustomerOrders
  },
  {
    path: '/admin-orders',
    name: 'AdminOrders',
    component: AdminOrders
  },
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  { 
    path: '/map', 
    name: 'map', 
    component: Map 
  },
  { 
    path: '/checkout', 
    name: 'checkout', 
    component: Checkout 
  }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})