import { createRouter, createWebHashHistory } from "vue-router";
import Login from '../components/Login/Login.vue';
import Register from '../components/Login/Register.vue';
import OwnerProfile from "@/components/Profile/OwnerProfile.vue";
import UserProfile from "@/components/Profile/UserProfile.vue";
import OwnerAccount from "@/components/Profile/OwnerAccount.vue";
import CustomerOrders from "@/components/OrderVue/CustomerOrders.vue";
import AdminOrders from "@/components/OrderVue/AdminOrders.vue";
import HomePage from "@/views/customer-views/HomePage.vue";
import Map from "@/views/customer-views/Map.vue";

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
    path: '/admin-orders',
    name: 'CustomerOrders',
    component: CustomerOrders
  },
  {
    path: '/customer-orders',
    name: 'AdminOrders',
    component: AdminOrders
  },
  {
    path: '/',
    name: 'home',
    component: HomePage},
  { 
    path: '/map', 
    name: 'map', 
    component: Map }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
