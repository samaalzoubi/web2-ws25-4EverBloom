<script setup>
import { useCartStore } from '@/stores/cartStore'
import { reactive, computed, onMounted } from 'vue'
import CartItemList from '@/components/CartItemList.vue';

const cartStore = useCartStore()

const totalQuantity = computed(() => cartStore.totalQuantity || 0)
const totalPrice = computed(() => cartStore.totalPrice || 0)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: ''
})

onMounted(async () => {
  if (!cartStore.cart) {
    await cartStore.loadActiveCart()
  }
})

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

/*async function placeOrder() {
  if (!cartStore.items.length) {
    alert('Your cart is empty.')
    return
  }

  // hier später richtige Backend-Order-Logik einbauen
  const payload = {
    userId: cartStore.cart?.userId,
    cart: cartStore.cart, // dein CartResponseDTO
    contactInfo: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone
    },
    deliveryInfo: {
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip
    },
    paymentInfo: {
      cardNumber: form.cardNumber,
      cardHolder: form.cardHolder,
      expiry: form.expiry,
      cvv: form.cvv
    }
  }

  console.log('PLACE ORDER PAYLOAD', payload)
  alert('Thank you for your order!')

  // optional: Cart leeren
  // await cartStore.clear()

  // wie früher: zur Bestellübersicht
  router.push({ name: 'customer-orders' }) // Route anpassen
}*/
</script>

<template>
<main>
        <div class="checkoutLayout">
            <div class="returnCart">
                <router-link to="/">Keep shopping</router-link>
                <h1>List Product in Cart</h1>
                <CartItemList
                    :items="cartStore.items"
                    :loading="cartStore.loading"
                    empty-message="Cart is empty"
                >
                    <template #actions="{ item }">
                        <div class="item__quantity item__quantity--static">
                        × {{ item.quantity }}
                        </div>
                    </template>
                </CartItemList>

            </div>

            <section class="checkout">
                <h1>CHECKOUT</h1>
                <form class="checkout-form" @submit.prevent="placeOrder">
                    <div class="checkout-card">
                        <h2 class="section-title">
                            <span class="icon">👤</span> Contact Information
                        </h2>
                        <div class="form">
                            <div class="group">
                                <label>
                                    Full Name
                                    <input type="text" v-model="form.fullName" required>
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    Email
                                    <input v-model="form.email" type="email" required>
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    Phone Number
                                    <input v-model="form.phone" type="tel">
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="checkout-card">
                        <h2 class="section-title">
                            <span class="icon">📍</span> Delivery Information
                        </h2>
                        <div class="form">
                            <div class="group">
                                <label>
                                    Street Address
                                    <input v-model="form.street" type="text" required>
                                </label>
                            </div>

                            <div class="group">
                                <label>
                                    City
                                    <input v-model="form.city" type="text" required>
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    State
                                    <select v-model="form.state">
                                        <option>Select state</option>
                                        <option value="Baden-Württemberg">Baden-Württemberg</option>
                                        <option value="Bavaria">Bavaria</option>
                                        <option value="Berlin">Berlin</option>
                                        <option value="Brandenburg">Brandenburg</option>
                                        <option value="Bremen">Bremen</option>
                                        <option value="Hamburg">Hamburg</option>
                                        <option value="Hesse">Hesse</option>
                                        <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
                                        <option value="Lower Saxony">Lower Saxony</option>
                                        <option value="North Rhine-Westphalia">North Rhine-Westphalia</option>
                                        <option value="Rhineland-Palatinate">Rhineland-Palatinate</option>
                                        <option value="Saarland">Saarland</option>
                                        <option value="Saxony">Saxony</option>
                                        <option value="Saxony-Anhalt">Saxony-Anhalt</option>
                                        <option value="Schleswig-Holstein">Schleswig-Holstein</option>
                                        <option value="Thuringia ">Thuringia</option>
                                    </select>
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    ZIP Code
                                    <input v-model="form.zip" type="text" required>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="checkout-card">
                        <h2 class="section-title">
                            <span class="icon">💳</span> Payment Information
                        </h2>
                        <div class="form">
                            <div class="group">
                                <label>
                                    Card Number
                                    <input
                                        v-model="form.cardNumber"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                    >
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    Cardholder Name
                                    <input 
                                        v-model="form.cardHolder"
                                        type="text"
                                        placeholder="John Doe"
                                    >
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    Expiry Date
                                    <input 
                                        v-model="form.expiry"
                                        type="text"
                                        placeholder="MM/YY"
                                    >
                                </label>
                            </div>
                            <div class="group">
                                <label>
                                    CVV
                                    <input 
                                    v-model="form.cvv"
                                    type="password"
                                    maxlength="4"
                                    placeholder="123"
                                    >
                                </label>
                            </div>
                        </div>
                        <div class="secure-msg">
                            🔒 Secure Payment - Your payment information is encrypted and safe.
                        </div>
                    </div>
                </form>
                
                <div class="return">
                    <div class="row">
                        <div>Total Quantity</div>
                        <div class="totalQuantity">{{ totalQuantity }}</div>
                    </div>
                    <div class="row">
                        <div>Total Price</div>
                        <div class="totalPrice">{{ formatPriceEUR(totalPrice) }}</div>
                    </div>
                </div>
                <button 
                    class="buttonOrder"
                    type="button"
                    :disabled="!cartStore.items.length"
                    @click="placeOrder"
                >
                    Place Order
                </button>
            </section>
        </div>
    </main>
</template>

<style scoped>
main {
  margin-top: 80px;
}

.checkoutLayout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 70px;
  padding: 20px;
}

.checkoutLayout .checkout {
  background: linear-gradient(#997ab9fb, rgba(213, 198, 215, 0.835));
  border-radius: 20px;
  padding: 40px;
  color: #fff;
  max-height: 80vh;
  overflow-y: scroll;
}

.checkout .checkout-card {
  margin-bottom: 15px;
  margin-top: 5px;
  padding: 10px;
  border-radius: 20px;
  background-color: #afafec36;
  border-left: 6px solid #584a8e;
  padding-left: 12px;
}

.checkout .checkout-card .section-title {
  color: #fff;
}

.checkout .secure-msg {
  margin-top: 10px;
  padding: 12px;
  background: #f4e8ff;
  border-radius: 10px;
  color: #6d38c3;
}

.checkout .return {
  border-top: 1px solid #5b4f8c;
  margin-top: 20px;
  padding-top: 20px;
}

.checkoutLayout .checkout .form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-bottom: 20px;
}

.checkoutLayout .form .group:nth-child(-n+3) {
  grid-column-start: 1;
  grid-column-end: 3;
}

.checkoutLayout .form .group {
  padding: 10px;
}

.checkoutLayout .form input,
.checkoutLayout .form select {
  width: 100%;
  box-sizing: border-box;
  background-color: #ece0f8b0;
  color: var(--color-text-dark);
  border: 0;
  min-width: 0;
}

.checkoutLayout .form .group label {
  display: block;
  text-align: left;
  margin: 10px 0 5px;
  color: #fff;
  font-weight: 500;
}

.checkoutLayout .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.checkoutLayout .row div:nth-child(2) {
  font-weight: bold;
  font-size: x-large;
}

.buttonOrder {
  width: 100%;
  height: 40px;
  border: 0;
  border-radius: 20px;
  margin-top: 20px;
  font-weight: bold;
  background: var(--color-accent-light);
  box-shadow: #9696de 0 10px 20px -10px;
  line-height: 24px;
  opacity: 1;
  color: #fff;
}

.buttonOrder:hover {
  background: #b896de;
}

.returnCart h1 {
  border-top: 1px solid #d5affcb0;
  padding: 20px 0;
  color: var(--color-accent-dark);
}

.section-title {
  width: 100%;
}

@media (max-width: 1000px) {
  .checkoutLayout {
    grid-template-columns: 1fr;
    row-gap: 40px;
  }

  .checkoutLayout .checkout {
    max-height: none;
    overflow-y: visible;
  }
}

.returnCart :deep(.item) {
  display: grid;
  grid-template-columns: 90px 1fr 80px;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  padding: 0 10px;
  box-shadow: #9696de 0 10px 20px -10px;
  border-radius: 20px;
  background-color: #997ab9bd;
  min-height: 90px;
  color: rgb(248, 245, 245);
}

.returnCart :deep(.item__image) {
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 16px;
}

.returnCart :deep(.item__name),
.returnCart :deep(.item__price) {
  font-size: 1.3rem;
  font-weight: bold;
}

.returnCart :deep(.item__quantity--static) {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
}

.returnCart :deep(.empty-cart) {
  font-style: italic;
  opacity: 0.7;
  padding: 20px 0;
}

.returnCart a {
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
  color: #6e56a7;
  font-weight: 600;
}

.returnCart a:hover {
  color: #fff;
  text-shadow: 0 0 4px #bdb4e6;
}
</style>
