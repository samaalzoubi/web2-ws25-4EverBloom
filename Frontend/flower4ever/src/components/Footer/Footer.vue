<template>
  <footer :class="['footer', { show: showFooter }]">
    <p class="footer-text">
      © 2025 <strong>Blümeo</strong> · Every bouquet tells a story of love, color, and creativity.
    </p>
  </footer>
</template>


<script>
export default {
  data() {
    return {
      lastScrollY: 0,
      showFooter: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const currentScroll = window.scrollY
      this.showFooter = currentScroll < this.lastScrollY
      this.lastScrollY = currentScroll
    }
  }
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: -10px;
  left: 0;
  width: 100%;
  background-color:  #b79bd3;
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #e6e6e6;
  transition: bottom 0.35s ease;
  z-index: 1000;
}

.footer.show {
  bottom: 0;
}

.footer-text {
  margin: 0;
  font-size: 14px;
  color: black;
}
</style>