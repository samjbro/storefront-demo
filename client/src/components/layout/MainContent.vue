<template>
  <div class="main-content">
    <MainNavbar />
    <ProductDisplay />
  </div>
</template>

<script>
import MainNavbar from './MainNavbar'
import ProductDisplay from '@/components/products/ProductDisplay'
export default {
  components: { MainNavbar, ProductDisplay }
}
</script>

<style lang="scss">
.main-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>


