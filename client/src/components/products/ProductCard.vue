<template>
  <div class="product-card">
      <img 
        class="product-card__thumb"
        :src="`https://backendapi.turing.com/images/products/${product.thumbnail}`"
        :alt="product.thumbnail">
      <div class="product-card__name">
        {{ product.name }}
      </div>
      <div class="product-card__price">
        £{{ product.price }}
      </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.product-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    background-color: $color-white;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 $color-gray-med; 
    font-weight: 600;
    
    &__thumb {
      width: 18rem;
      height: auto;
      margin-bottom: 2rem;
    }

    &__name {
      margin-bottom: 1rem;
    }

    &__price {
      color: $color-red;
    }
}
</style>
