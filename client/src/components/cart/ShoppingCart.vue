<template>
  <div class="shopping-cart">
    <h1 class="shopping-cart__header">
      {{ currentCustomer.cart.items.length }} Item{{ currentCustomer.cart.items.length !== 1 ? 's' : ''}} In Your Cart
    </h1>
    <div class="shopping-cart__content">
      <div>
        <div class="shopping-cart__row shopping-cart__row--header">
          <div class="shopping-cart__col shopping-cart__col--header shopping-cart__col--item">
            Item
          </div>
          <div class="shopping-cart__col shopping-cart__col--header shopping-cart__col--size">
            Size
          </div>
          <div class="shopping-cart__col shopping-cart__col--header shopping-cart__col--quantity">
            Quantity
          </div>
          <div class="shopping-cart__col shopping-cart__col--price shopping-cart__col--header">
            Price
          </div>
        </div>
      </div>
      <div class="shopping-cart__items">
        <div v-if="!currentCustomer.cart.items.length" class="shopping-cart__row">
          <div class="shopping-cart__col shopping-cart__col--item shopping-cart__col--empty">
            No Items In Cart
          </div>
        </div>
        <div 
          class="shopping-cart__row"
          v-for="item in currentCustomer.cart.items" :key="item.cart_item_id">
          <div class="shopping-cart__col shopping-cart__col--item">
            <img
              class="shopping-cart__name-image"
              :src="`https://backendapi.turing.com/images/products/${item.product.image}`"
              :alt="item.product.image"
            >
            <div class="shopping-cart__name-info">
              <div class="shopping-cart__name-header">
                {{ item.product.name }}
              </div>
              <div class="shopping-cart__name-subheader">
                {{ item.color }}
              </div>
              <div class="shopping-cart__name-remove" @click="remove(item)">
                <img src="~img/close-red.svg" alt="remove">
                Remove
              </div>
            </div>
          </div>
          <div class="shopping-cart__col shopping-cart__col--size">
            {{ item.size }}
          </div>
          <div class="shopping-cart__col shopping-cart__col--quantity">
            <QuantityInput :quantity="item.quantity" @increment="direction => increment(direction, item)" />
          </div>
          <div class="shopping-cart__col shopping-cart__col--price">
            {{ formatPrice(getItemPrice(item)) }}
          </div>
        </div>
      </div>
      <div class="shopping-cart__total">
        Total Price: {{ formatPrice(totalPrice) }}
      </div>
    </div>
    <div class="shopping-cart__buttons">
      <button class="button" @click="goBack">Back</button>
      <button class="button" @click="checkout">Checkout</button>
    </div>
  </div>
</template>

<script>
import { GET_CURRENT_CUSTOMER, SHOW_OVERLAY, GET_CURRENT_PRODUCT, CLOSE_OVERLAY, UPDATE_CART, REMOVE_CART_ITEM } from '@/apollo/operations'
import QuantityInput from '@/components/shared/QuantityInput'
export default {
  components: { QuantityInput },
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
    },
    checkout () {
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: {
          view: 'checkout'
        }
      })
    },
    getItemPrice (item) {
      return ((parseFloat(item.product.price) * 100 * item.quantity)/ 100).toFixed(2)
    },
    formatPrice (price) {
      return '£' + price
    },
    increment (direction, item) {
      if (item.quantity + direction < 1) return
      this.$apollo.mutate({
        mutation: UPDATE_CART,
        variables: {
          data: {
            item_id: parseInt(item.item_id),
            quantity: item.quantity + direction
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCart: {
            __typename: 'CartItem',
            quantity: item.quantity + direction,
            product: item.product,
            size: item.size,
            color: item.color
          }
        },
        update: (cache, { data: { updateCart }}) => {
          this.currentCustomer.cart.items
            .find(oldItem => oldItem.item_id === item.item_id)
            .quantity = updateCart.quantity
          cache.writeQuery({ query: GET_CURRENT_CUSTOMER, data: {
             currentCustomer: this.currentCustomer 
          }})
        }
      })
    },
    remove (item) {
      this.$apollo.mutate({
        mutation: REMOVE_CART_ITEM,
        variables: {
          item_id: parseInt(item.item_id)
        },
        update: (cache, { data: { removeCartItem }}) => {
          this.currentCustomer.cart.items = this.currentCustomer.cart.items.filter(oldItem =>{
            return oldItem.item_id !== item.item_id
          })
          cache.writeQuery({ query: GET_CURRENT_CUSTOMER, data: {
            currentCustomer: this.currentCustomer
          }})
        }
      })
    }
  },
  computed: {
    totalPrice () {
      return this.currentCustomer.cart.items.reduce((cur, inc) => {
        return cur + parseFloat(this.getItemPrice(inc))
      }, 0).toFixed(2)
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
@import "~#/abstracts/variables";
.shopping-cart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // background: red;
  height: 100%;

  &__header {
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
  }
  &__content {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  &__items {
    overflow-y: auto;
    height: 100%;
    border-bottom: 1px solid $color-gray-light-2;
    & > * {
      &:first-child {
        padding-top: 1rem;
      }
    }
  }
  &__row {
    // flex: 1;
    display: flex;
    padding-bottom: 1.5rem;
    &--header {
      color: $color-gray-light-2;
      padding-bottom: 1rem;
      border-bottom: 1px solid $color-gray-light-2;
    }
  }
  &__col {
    display: flex;
    align-items: center;
    justify-content: center;
    &--item {
      flex: 4;
      display: flex;
      align-items: initial;
      justify-content: flex-start;
    }
    &--size {
      flex: 1;
      font-size: 1.6rem;
    }
    &--price {
      flex: 1;
      font-size: 2rem;
      font-weight: 600;
    }
    &--quantity {
      flex: 2
    }
    &--header {
      font-size: 1.3rem;
      font-weight: 600;
    }
    &--empty {
      font-size: 1.8rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
      color: $color-gray-light-2;
      margin: 3rem 0;
    }
  }

  &__buttons {
    display: flex;

    & > * {
      &:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }

  &__name-image {
    margin-right: 2rem;
    max-height: 10rem;
  }
  &__name-info {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__name-header {
    font-size: 1.6rem;
    font-weight: 600;
  }
  &__name-subheader {
    font-size: 1.5rem;
    color: $color-gray-med;
  }
  &__name-remove {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: $color-gray-med;
    cursor: pointer;
    &:active {
      color: $color-red;
    }
  }
  &__total {

    padding: 1rem;
    padding-bottom: 0;
    text-align: right;
    font-size: 1.8rem;
    font-weight: 600;
  }
}
</style>
