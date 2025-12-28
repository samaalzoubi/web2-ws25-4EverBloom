import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHomeShops } from '@/services/home.js'

export const useShopStore = defineStore('shop', () => {
  const shops = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadHomeShops() {
    loading.value = true
    error.value = null
    try {
      shops.value = await fetchHomeShops()
    } catch (e) {
      console.error('Failed to load shops', e)
      error.value = 'Could not load shop data.'
    } finally {
      loading.value = false
    }
  }

  return { shops, loading, error, loadHomeShops }
})
