import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  getActiveCart,
  addToCart,
  patchCartItemQuantity,
  clearCart
} from '@/services/cartService.js'

const DEFAULT_BOUQUET_IMAGE =
  'https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2'

function getUserIdOrNull() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const role = localStorage.getItem('role')

  if (!isLoggedIn || role !== 'CUSTOMER') {
    return null
  }

  return localStorage.getItem('userId')
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref(null)
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )

  const isCustomer = computed(
    () => localStorage.getItem('role') === 'CUSTOMER'
  )

  const canUseCart = computed(
    () => isLoggedIn.value && isCustomer.value
  )

  const items = computed(() =>
    canUseCart.value
      ? (cart.value?.items ?? []).map(item => ({
          ...item,
          imageUrl: item.imageUrl || DEFAULT_BOUQUET_IMAGE
        }))
      : []
  )

  const totalQuantity = computed(
    () => (canUseCart.value ? cart.value?.totalQuantity ?? 0 : 0)
  )

  const totalPrice = computed(
    () => (canUseCart.value ? cart.value?.totalPrice ?? 0 : 0)
  )

  const toggle = () => {
    if (!canUseCart.value) return
    isOpen.value = !isOpen.value
  }

  const open = () => {
    if (!canUseCart.value) return
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  async function loadActiveCart() {
    const userId = getUserIdOrNull()
    if (!userId) return

    loading.value = true
    error.value = null
    try {
      cart.value = await getActiveCart(userId)
    } catch (e) {
      console.error(e)
      error.value = e.message || 'Could not load cart.'
    } finally {
      loading.value = false
    }
  }

  async function addBouquet(bouquetId) {
    const userId = getUserIdOrNull()
    if (!userId) return

    loading.value = true
    error.value = null
    try {
      cart.value = await addToCart(userId, bouquetId)
      isOpen.value = true
    } catch (e) {
      console.error(e)
      error.value = e.message || 'Could not add to cart.'
    } finally {
      loading.value = false
    }
  }

  async function changeQuantity(itemId, delta) {
    const userId = getUserIdOrNull()
    if (!userId) return

    loading.value = true
    error.value = null
    try {
      cart.value = await patchCartItemQuantity(userId, itemId, delta)
    } catch (e) {
      console.error(e)
      error.value = e.message || 'Could not update quantity.'
    } finally {
      loading.value = false
    }
  }

  async function clear() {
    const userId = getUserIdOrNull()
    if (!userId) return

    loading.value = true
    error.value = null
    try {
      cart.value = await clearCart(userId)
    } catch (e) {
      console.error(e)
      error.value = e.message || 'Cart could not be emptied.'
    } finally {
      loading.value = false
    }
  }

  watch(canUseCart, allowed => {
    if (!allowed) {
      cart.value = null
      isOpen.value = false
    }
  })

  return {
    cart,
    items,
    totalQuantity,
    totalPrice,
    isOpen,
    loading,
    error,

    canUseCart,
    isCustomer,

    toggle,
    open,
    close,

    loadActiveCart,
    addBouquet,
    changeQuantity,
    clear
  }
})