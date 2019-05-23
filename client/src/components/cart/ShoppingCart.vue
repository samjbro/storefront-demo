<template>
  <div class="shopping-cart">
    <h1 class="shopping-cart__header">
      {{ currentCustomer.cart.items.length }} Items In Your Cart
    </h1>
    <div v-for="item in currentCustomer.cart.items" :key="item.cart_item_id">
      {{ item.product.name }}
    </div>
    <div class="shopping-cart__buttons">
      <button class="button" @click="goBack">Back</button>
      <button class="button">Checkout</button>
    </div>
  </div>
</template>

<script>
import { GET_CURRENT_CUSTOMER, SHOW_OVERLAY, GET_CURRENT_PRODUCT, CLOSE_OVERLAY } from '@/apollo/operations'
export default {
  methods: {
    goBack () {
      if (!this.currentProduct) {
        this.$apollo.mutate({
          mutation: CLOSE_OVERLAY
        })
      } else {
        this.$apollo.mutate({
          mutation: SHOW_OVERLAY,
          variables: {
            view: 'product'
          }
        })
      }
    }
  },
  apollo: {
    currentCustomer () {
      return {
        query: GET_CURRENT_CUSTOMER
      }
    },
    currentProduct () {
      return {
        query: GET_CURRENT_PRODUCT
      }
    }
  }
}
</script>

<style lang="scss">
.shopping-cart {
  &__buttons {
    display: flex;

    & > * {
      &:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }
}
</style>
