<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  emptyMessage: { type: String, default: 'Cart is empty' },
  defaultImage: {
    type: String,
    default: 'https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2'
  }
})

function formatPriceEUR(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value ?? 0)
}
</script>

<template>
  <div class="cart-item-list">
    
    <div v-if="loading" class="cart-status">Loading cart…</div>

    <div v-else-if="!items.length" class="empty-cart">
      {{ emptyMessage }}
    </div>

    <template v-else>
      <div 
        v-for="item in items" 
        :key="item.itemId" 
        class="item"
      >
        <img 
          class="item__image"
          :src="item.imageUrl || defaultImage" 
          :alt="item.bouquetName"
        />

        <div class="item__info">
          <slot name="name" :item="item">
            <div class="item__name">{{ item.bouquetName }}</div>
          </slot>

          <slot name="price" :item="item">
            <div class="item__price">
              {{ formatPriceEUR(item.unitPrice) }}
            </div>
          </slot>
        </div>

        <slot name="actions" :item="item">
          <div class="item__quantity item__quantity--static">
            × {{ item.quantity }}
          </div>
        </slot>

      </div>
    </template>
    
  </div>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
}
.item__image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}
.item__name {
  font-weight: 600;
}
.item__price {
  opacity: 0.85;
  font-size: .9rem;
}
.item__quantity--static {
  font-weight: 600;
}
.qty-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>
