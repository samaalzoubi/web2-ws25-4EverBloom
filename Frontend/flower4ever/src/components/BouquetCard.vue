<template>
  <li class="bouquet-card">
    <div class="bouquet-card__link">
      <figure class="bouquet-card__media">
        <img :src="bouquet.imageUrl" :alt="bouquet.name" />
        <span class="bouquet-card__label">Exclusive</span>
      </figure>

      <figcaption class="bouquet-card__caption">
        <span class="bouquet-card__name">{{ bouquet.name }}</span>
        <span class="bouquet-card__price">{{ formatPriceEUR(bouquet.price) }}</span>

        <div class="bouquet-card__bottom-row">
          <button
            class="add-to-cart-btn"
            type="button"
            @click="$emit('add-to-cart', bouquet)"
          >
            Add to Cart
          </button>

          <div class="bouquet-card__shop">
            <img
              class="bouquet-card__shop-logo"
              :src="bouquet.shopLogo"
              alt="Shop logo"
              @click.stop="$emit('shop-click', bouquet.shopId)"
            />
          </div>
        </div>
      </figcaption>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  bouquet: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['shop-click', 'add-to-cart'])

function formatPriceEUR(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}
</script>

<style scoped>
.bouquet-card__bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
}

.bouquet-card__shop-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid var(--color-accent-light);
}

.bouquet-card__link{
  color: inherit;
  text-decoration: none;
  transition: transform 0.9s ease, box-shadow 0.4s ease, background-color .4s ease;
  transform-origin: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 550px;
}

.bouquet-card__link:hover{
  transform: translateY(-6px) rotate(1deg);
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.15);
  background-color: #e3d8f1;
}

.bouquet-card__media{
  margin: 0;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 10px 24px rgba(0,0,0,.08);
  position: relative;
}

.bouquet-card__label {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to left, var(--color-accent-light), rgb(241, 194, 236)) border-box;
  color: var(--color-accent-dark);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 1em;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.04em;
  opacity: 0.9;
}

.bouquet-card__media img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bouquet-card__caption{
  padding: 18px 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.add-to-cart-btn {
  background: var(--color-accent-light);
  border-radius: 999px;
  box-shadow: #9696de 0 10px 20px -10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  opacity: 1;
  padding: 8px 18px;
  margin-top: 4px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  border: 0;
  margin-left: 33%;
}

.add-to-cart-btn:hover {
  background: var(--color-btn-hover);
}
</style>
