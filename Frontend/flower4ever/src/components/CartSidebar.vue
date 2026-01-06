<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import CartItemList from './CartItemList.vue'

const cartStore = useCartStore()
const router = useRouter()

onMounted(async () => {
  await cartStore.loadActiveCart()
})

const cartClasses = computed(() => ({
  cart: true,
  'cart--open': cartStore.isOpen
}))

function handleCheckout() {
  cartStore.close()
  router.push({ name: 'checkout' })
}

function changeQty(itemId, op) {
  const delta = op === '+' ? 1 : -1
  cartStore.changeQuantity(itemId, delta)
}

function formatPrice(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value ?? 0)
}
</script>

<template>
  <aside :class="cartClasses">
    <div class="clear-cart">
      <h2>CART</h2>
      <div class="clear">
        <a 
            @click="cartStore.clear"
            id="clearCartBtn" 
            class="clear-cart-btn"
        >🗑️ CLEAR CART</a>
    </div>
    </div>

    <CartItemList
        :items="cartStore.items"
        :loading="cartStore.loading"
        >

        <template #actions="{ item }">
            <div class="item__quantity">
              <button @click="changeQty(item.itemId, '-')">-</button>
              <span class="value">{{ item.quantity }}</span>
              <button @click="changeQty(item.itemId, '+')">+</button>
            </div>
        </template>

    </CartItemList>

    <div class="cart-total">
        <span class="cart-total__label">Total:</span>
        <span class="cart-total__value">{{ formatPrice(cartStore.totalPrice) }}</span>
    </div>

    <div class="buttons">
        <div @click="cartStore.close" class="close">CLOSE</div>
        <div 
            @click="handleCheckout" 
            :class="{ 'checkout--disabled': !cartStore.items.length }"
            class="checkout">
            <a id="checkoutBtn">CHECKOUT</a>
        </div>
    </div>
  </aside>
</template>

<style scoped>
.cart {
  position: fixed;
  top: 0;
  right: -100%;
  width: 400px;
  height: 100vh;
  background: linear-gradient(#997ab9fb, rgba(237, 219, 240, 0.835));
  display: grid;
  grid-template-rows: 50px 1fr 50px;
  gap: 20px;
  z-index: 1000;
  transition: right 1s;
  color: white;
}

.cart.cart--open {
  right: 0;
}

.cart :deep(.cart-item-list) {
  overflow: auto;
  padding: 20px;
}

.cart h2 {
  padding: 20px;
  margin: 0;
  color: rgb(255, 255, 255);
}

.cart :deep(.item__name), .cart :deep(.item__price) {
  font-weight: bold;
}

.cart :deep(.item__quantity) {
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 13px;
  gap: 6px;
}

.cart :deep(.item__quantity button) {
  background: rgba(255, 255, 255, 0.18);
  border: none;
  border-radius: 20%;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.cart :deep(.item__quantity button:hover) {
  background: var(--color-accent-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

.cart :deep(.item) {
  display: grid;
  grid-template-columns: 50px 1fr 70px;
  align-items: center;
  gap: 25px;
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.282);
}

.cart .buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  text-align: center;
}

.cart .buttons div {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}

.cart .buttons a {
  color: white;
  text-decoration: none;
}

.cart .buttons .checkout {
  background: var(--color-accent-light);
  border-radius: 999px;
  box-shadow: #9696de 0 10px 20px -10px;
  box-sizing: border-box;
  line-height: 24px;
  opacity: 1;
  width: 150px;
  border: 0;
}

.cart .buttons .checkout:hover {
  background: var(--color-btn-hover);
}

.cart .buttons .checkout.checkout--disabled {
  pointer-events: none;
  cursor: default;
  background: grey;
}

.cart .buttons .close:hover {
  color: var(--color-btn-hover);
}

.cart .clear-cart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.cart .clear {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  margin: 8px 8px;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid #c80c0c65;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.cart .clear:hover {
  background-color: #c62828;
  color: #ffffff;
}

.cart-total {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  margin: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.282);
  backdrop-filter: blur(6px);
}

.cart-total__label {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(59, 17, 82, 0.619);
  letter-spacing: 0.03em;
}

.cart-total__value {
  font-size: 1.15rem;
  font-weight: 700;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: rgba(59, 17, 82, 0.619);
  letter-spacing: 0.02rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
</style>