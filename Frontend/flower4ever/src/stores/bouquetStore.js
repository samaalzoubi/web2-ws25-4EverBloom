import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHomeBouquets } from '@/services/home.js'

export const useBouquetStore = defineStore('bouquet', () => {
  const bouquets = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadHomeBouquets() {
    loading.value = true
    error.value = null
    try {
      const loadedBouquets = await fetchHomeBouquets()
      bouquets.value = loadedBouquets
    } catch (e) {
      console.error('Failed to load bouquets', e)
      error.value = 'Could not load bouquet data. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { bouquets, loading, error, loadHomeBouquets }
})
