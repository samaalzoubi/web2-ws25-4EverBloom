<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/flowerShopStore.js'

const shopStore = useShopStore()
const router = useRouter()

const map = ref(null)

onMounted(async () => {
  await shopStore.loadHomeShops()
  initMap()
})

function initMap() {
  map.value = L.map('map').setView([51.5, 7.4], 11)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value)

  addShopsToMap()
}

function addShopsToMap() {
  const leafletMap = map.value
  if (!leafletMap) return

  const bounds = []

  shopStore.shops.forEach(shop => {
    const lat = shop.latitude
    const lon = shop.longitude

    if (lat == null || lon == null) return

    const marker = L.marker([lat, lon]).addTo(leafletMap)

    const name = shop.shopName || 'Flower shop'
    const addressText = shop.address
      ? `${shop.address.streetAddress ?? ''}, ${shop.address.zipCode ?? ''} ${shop.address.city ?? ''}, ${shop.address.state ?? ''}`
      : ''

    const popupHtml = `
      <div class="popup-content">
        ${shop.logo ? `<img class="popup-logo" src="${shop.logo}" />` : ""}
        <div class="popup-name">${name}</div>
        <div class="popup-address">${addressText}</div>
        <button class="popup-btn" type="button">
          View shop
        </button>
      </div>
    `

    marker.bindPopup(popupHtml)

    marker.on('popupopen', e => {
      const root = e.popup.getElement()
      const btn = root?.querySelector('.popup-btn')
      if (btn) {
        btn.addEventListener('click', () => {
          router.push({ name: 'shop-profile', query: { shopId: shop.id } })
        })
      }
    })

    bounds.push([lat, lon])
  })

  if (bounds.length > 0) {
    leafletMap.fitBounds(bounds, { padding: [40, 40] })
  }
}
</script>


<template>
  <div class="shops-count"><h2>Total flower shops' count: {{ shopStore.shops.length }}</h2></div>
  <main>
    <div class="leaflet-map" id="map"></div>
  </main>
</template>

<style scoped>
main {
    height: 100vh;
    padding-top: 0;
}

#map { 
    height: 70vh; 
    width: 100%;
}

.leaflet-map {
    border-radius: 3%;
    box-shadow: #9696de 0px 5px 15px;
}

.shops-count {
  text-align: center;
  margin: 60px 0 30px;
}

.shops-count h2 {
  display: inline-block;
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 0.03rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid rgba(116, 92, 175, 0.459);
  width: fit-content;
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
}

:deep(.popup-content) {
  text-align: center;
  padding: 6px;
}

:deep(.popup-logo) {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 6px;
  border: 2px solid var(--color-accent-light);
}

:deep(.popup-name) {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
}

:deep(.popup-address) {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 6px;
}

:deep(.popup-btn) {
  background: var(--color-accent-light);
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  transition: 0.2s;
}

:deep(.popup-btn:hover) {
  opacity: 0.85;
  background-color: var(--color-btn-hover);
}
</style>
