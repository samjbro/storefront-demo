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
@import "~#/abstracts/mixins";
.product-display {
  display: flex;
  padding: 1.5rem 3rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  height: 100%;

  @include respond(phone) {
    flex-direction: column;
    padding: 0;
  }

  &__filters {
    flex: 1;
    z-index: 2;
    @include respond(phone) {
      flex-grow: 0;
    }
  }

  &__cards {
    flex: 4;
    z-index: 1;
  }
}
</style>

