<script setup>
import { onMounted, computed } from 'vue'
import { useBouquetStore } from '@/stores/bouquetStore.js'
import { useShopStore } from '@/stores/flowerShopStore.js'
import ShopCarousel from '@/components/ShopCarousel.vue'
import PetalsSection from '@/components/PetalsSection.vue'
import BouquetCard from '@/components/BouquetCard.vue'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const bouquetStore = useBouquetStore()
const shopStore = useShopStore()

onMounted(async () => {
  await Promise.all([
    bouquetStore.loadHomeBouquets(),
    shopStore.loadHomeShops()
  ])
})

function handleAddToCart(bouquet) {
  cartStore.addBouquet(bouquet.id)
}

function callShopProfile(shopId) {
    //TODO
    console.log("Hey there! You are trying to call shop-profile-page... Well, it hasn't been implemented yet!")
    //router.push({ name: 'shop-profile', query: { shopId: shopId } })
}
</script>

<template>
    <main>
        <section class="banner">
                <h2>Create & Send Beautiful Bouquets – Fresh, Local & Designed for You</h2>
                <div class="under-banner">
                    <p>At Blümeo, every bouquet is crafted with love by local florists and brought to life in our 3D flower designer.</p>
                    <p>Explore, customize, and send your perfect arrangement – whether for birthdays, celebrations, or “just because.”</p>
                    <p>Enjoy same-day delivery from trusted local shops. Transparent prices, no hidden fees – just pure floral joy delivered to your doorstep.</p>
                </div>
        </section>

        <div class="search-and-carousel">
            <div class="search-container">
                <button type="button"><span class="material-symbols-outlined">search</span></button>
                <input type="text" name="address" placeholder="Find your perfect bouquet...📍">
                <router-link to="/map" class="map-btn" title="Open map">
                    <span class="material-symbols-outlined">map_search</span>
                </router-link>
            </div>
        </div>

        <div class="back-video-container">
            <video class="background-video" autoplay loop muted playsinline src="@/assets/flowers_background.mp4"></video>
            <div id="citation">
                <p>“I must have flowers, always, and always.” <strong>― Claude Monet</strong></p>
            </div>
        </div>
    
        <div v-if="shopStore.loading">Loading…</div>
        <ShopCarousel 
            v-else
            :shops="shopStore.shops"
            @shop-click="callShopProfile"
        ></ShopCarousel>

        <PetalsSection>
            <BouquetCard
                v-for="b in bouquetStore.bouquets"
                :key="b.id"
                :bouquet="b"
                @add-to-cart="handleAddToCart"
                @shop-click="callShopProfile"
            ></BouquetCard>
        </PetalsSection>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    justify-content: flex-start;
}

.search-container input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 16px;
  
}

.search-container input::placeholder {
    color: var( --color-text-dark);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid var(--color-header-background);
  border-radius: 10px;
  padding: 8px 14px;
  max-width: 650px;
  flex: 1 1 clamp(260px, 40%, 520px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: var(--color-header-background);
}

.search-container .material-symbols-outlined {
  color: var(--color-text-dark);    
  cursor: pointer;  
}

.search-container .material-symbols-outlined:hover {
    color: var(--color-hover);
}

.search-container button {
    background: transparent;
    outline: none;
    border: none;
}

.banner {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  flex-direction: column;
  margin-top: 10rem;
  padding-left: 4rem;
}

.banner h2 {
  line-height: 1.2;
  font-weight: 600;
  font-size: 30px;
  background: linear-gradient(to left, var(--color-accent-light), rgb(241, 194, 236));
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text; /* for Safari and Chrome */
  background-clip: text; /* for Firefox */
}

.banner p { 
    margin: 6px 0; 
    line-height: 1.3; 
    color: var(--color-text-dark); 
}

.search-and-carousel {
  display: flex;
  align-items: flex-start; 
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 4rem;
  margin-bottom: 5rem;
}

.back-video-container {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-video {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 1;
  object-fit: cover;
  display: block;
  opacity: 0.7;
  z-index: -1;
  filter: brightness(0.8) contrast(1.05);
}

#citation p {
  letter-spacing: 0.06rem;
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 300;
}

#citation {
  position: absolute;
  z-index: 100;
  color: white;
  text-align: center;
  padding: 0 1rem;
}

@media(max-width: 900px){
  .content{ flex-direction:column; }
  .search-and-carousel {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>