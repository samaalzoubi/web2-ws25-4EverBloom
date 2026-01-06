import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getActiveCart, addToCart, patchCartItemQuantity, clearCart } from '@/services/cartService.js'

const DEFAULT_BOUQUET_IMAGE = 'https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2'

function getUserIdOrWarn() {
    //TODO
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('Log in first!')
    return null
  }
  const userId = localStorage.getItem('userId')
  if (!userId) {
    alert('Missing userId. Please log in again.')
    return null
  }
  return userId
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref(null)
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref(null)

  const items = computed(() =>
    (cart.value?.items ?? []).map(item => ({
      ...item,
      imageUrl: item.imageUrl || DEFAULT_BOUQUET_IMAGE
    }))
  )

  const totalQuantity = computed(
    () => cart.value?.totalQuantity ?? 0
  )

  const totalPrice = computed(
    () => cart.value?.totalPrice ?? 0
  )

  const toggle = () => { isOpen.value = !isOpen.value }
  const open   = () => { isOpen.value = true }
  const close  = () => { isOpen.value = false }

  async function loadActiveCart() {
    const userId = getUserIdOrWarn()
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
    const userId = getUserIdOrWarn()
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
    const userId = getUserIdOrWarn()
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
    const userId = getUserIdOrWarn()
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

  return { cart, items, totalQuantity, totalPrice, isOpen, loading, error, toggle, open, close, loadActiveCart, addBouquet, changeQuantity, clear }
})
