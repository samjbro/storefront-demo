<template>
  <div class="product-display">
    <ProductFilters />
    <ProductCards />
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
}
</style>

