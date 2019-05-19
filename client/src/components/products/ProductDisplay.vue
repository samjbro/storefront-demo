<template>
  <div class="product-display">
    <ProductFilters class="product-display__filters" />
    <ProductCards class="product-display__cards" />
  </div>
</template>

<script>
import ProductFilters from './ProductFilters'
import ProductCards from './ProductCards'
export default {
  components: { ProductFilters, ProductCards }
}
</script>


<style lang="scss">
.product-display {
  display: flex;
  padding: 1.5rem 3rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  &__cards {
    flex: 4;
  }
}
</style>

