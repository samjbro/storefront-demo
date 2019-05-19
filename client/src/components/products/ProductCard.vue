<template>
  <transition name="product-card--transitioning">
  <div class="product-card" @click="showProduct">
    <div class="product-card__thumb" :class="{'product-card__thumb--loading': product.loading}">
      <fa-icon
        v-if="product.loading"
        class="product-card__spinner"
        :icon="['fas', 'spinner']" 
        spin
      />
      <img
        v-else
        :src="`https://backendapi.turing.com/images/products/${product.thumbnail}`"
        :alt="product.thumbnail">
    </div>
    <div class="product-card__name">
      {{ product.name }}
    </div>
    <div class="product-card__price">
      {{ formattedPrice }}
    </div>
  </div>
  </transition>
</template>

<script>
import { SHOW_OVERLAY, GET_PRODUCT, SET_CURRENT_PRODUCT } from '@/apollo/operations'
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    async showProduct () {
      this.$apollo.mutate({
        mutation: SET_CURRENT_PRODUCT,
        variables: {
          product: null
        }
      })
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: { view: 'product' }
      })
      const { data } = await this.$apollo.query({
        query: GET_PRODUCT,
        variables: {
          id: this.product.product_id
        }
      })
      this.$apollo.mutate({
        mutation: SET_CURRENT_PRODUCT,
        variables: {
          product: data.product
        }
      })

    }
  },
  computed: {
    formattedPrice () {
      if (this.product.loading) return this.product.price
      return '£' + this.product.price
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
  box-shadow: 0 .2rem .4rem 0 $color-gray-med; 
  font-weight: 600;
  min-height: 30rem;
  cursor: pointer;
  transition: all .3s;

  &:hover {
    transform: translateY(-.7rem);
    box-shadow: 0 .4rem .8rem 0 $color-gray-med; 
  }
  
  &__thumb {
    width: 18rem;
    height: 17rem;
    margin-bottom: 2rem;

    &--loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  &__name {
    margin-bottom: 1rem;
  }

  &__price {
    color: $color-red;
  }

  &__spinner {
    font-size: 4rem;
  }

}
</style>
