import { createRouter, createWebHashHistory } from "vue-router";
import Login from '../components/Login/Login.vue';
import Register from '../components/Login/Register.vue';
import OwnerProfileEdit from "@/components/Profile/OwnerProfileEdit.vue";
import CustomerProfileEdit from "@/components/Profile/CustomerProfileEdit.vue";
import CustomerOrders from "@/components/Order/CustomerOrders.vue";
import AdminOrders from "@/components/Order/AdminOrders.vue";
import HomePage from "@/views/customer-views/HomePage.vue";
import Map from "@/views/customer-views/Map.vue";
import Checkout from "@/views/customer-views/Checkout.vue";
import CustomerShopProfile from "@/views/customer-views/ShopProfile.vue";
import ManageBouquets from "@/views/shop-owner-view/ManageBouquets.vue";
import ManageInventory from "@/views/shop-owner-view/ManageInventory.vue";
import ShopOwnerHome from '@/views/shop-owner-view/ShopOwnerHome.vue'
import Dashboard from "@/views/shop-owner-view/Dashboard.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/ownerProfileEdit',
    component: OwnerProfileEdit
  },  
  {
    path: '/customerProfileEdit',
    component: CustomerProfileEdit
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
  },
  {
    path: '/shop-profile',
    name: 'shop-profile',
    component: CustomerShopProfile
  },
  {
    path: "/manage-bouquets",
    name: "ManageBouquets",
    component: ManageBouquets
  },
  {
    path: '/manage-inventory',
    name: 'ManageInventory',
    component: ManageInventory
  },
{
  path: '/shop-owner-home', 
  name: 'OwnerHome',
  component: ShopOwnerHome
},
{
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  }

]

export default createRouter({
    history: createWebHashHistory(),
    routes
})