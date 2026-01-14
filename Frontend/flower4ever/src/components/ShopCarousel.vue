<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  shops: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['shop-click'])

const carouselEl = ref(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

onMounted(async () => {
  await nextTick()
  updateButtons()
})

function scrollCarousel(direction) {
  const el = carouselEl.value
  if (!el) return

  const firstImage = el.querySelector('img')
  const step = (firstImage?.clientWidth || 200) + 35

  el.scrollLeft += direction === 'next' ? step : -step

  setTimeout(updateButtons, 60)
}

function updateButtons() {
  const el = carouselEl.value
  if (!el) return

  const scrollWidth = el.scrollWidth - el.clientWidth

  if (scrollWidth <= 0) {
    canScrollPrev.value = false
    canScrollNext.value = false
    return
  }

  canScrollPrev.value = el.scrollLeft > 0
  canScrollNext.value = el.scrollLeft < scrollWidth
}
</script>

<template>
<div class="happiness-hubs">
    <h3>Happiness Hubs</h3>

    <button
      class="carousel-button prev"
      type="button"
      @click="scrollCarousel('prev')"
      :disabled="!canScrollPrev"
    >
      &#10594;
    </button>

    <button
      class="carousel-button next"
      type="button"
      @click="scrollCarousel('next')"
      :disabled="!canScrollNext"
    >
      &#10596;
    </button>

    <div
      ref="carouselEl"
      class="carousel"
      id="shop-carousel"
      @scroll="updateButtons"
    >
      <img
        v-for="shop in shops"
        :key="shop.id"
        class="carousel-image"
        :src="shop.logo"
        :alt="shop.shopName || 'Flower Shop'"
        @click.stop="$emit('shop-click', shop.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.happiness-hubs {
  width: 100%;
  position: relative;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  overflow: hidden;
  margin-top: 80px;
}

.happiness-hubs .carousel {
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  width: 90%;
  scroll-behavior: smooth;
}

.happiness-hubs h3 {
  font-size: 1.8rem;
  font-weight: 450;
  letter-spacing: 0.06rem; 
  color: rgb(51, 51, 51);
  margin-bottom: 1.5rem;
  position: relative;
}

.happiness-hubs h3::after {
  content: "";
  display: block;
  width: 100px;
  height: 3px;
  margin: 0.6rem auto 0;
  background: var(--color-accent-light);
  border-radius: 3px;
  opacity: 0.7;
}


.carousel img {
  height: 200px;
  width: calc(100% / 7);
  object-fit: cover;
  margin-left: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-light);
}

.carousel img:first-child {
  margin-left: 0px;
}

.carousel-button {
  position: absolute;
  background: none;
  border: none;
  font-size: 2rem;
  height: 45px;
  width: 45px;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, .5);
  border-radius: 50%;
  background-color: rgba(53, 22, 77, 0.1);
  cursor: pointer;
}

.carousel-button:hover, 
.carousel-button:focus {
  color: white;
  background-color: rgba(53, 22, 77, 0.3);
}

.carousel-button:focus {
  outline: 1px solid black;
}

.carousel-button.prev { left: clamp(6px, 1.5vw, 14px); }
.carousel-button.next { right: clamp(6px, 1.5vw, 14px); }

@media(max-width: 900px){
  .carousel img {
    width: calc(100% / 3);
  }

  .carousel-button { width: 40px; height: 40px; }
}
</style>