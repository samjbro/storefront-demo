<template>
  <div class="confirmation-page">
    <div class="confirmation-page__content">
      <div class="confirmation-page__details">
        <div class="confirmation-page__summary">
          <h3 class="confirmation-page__header">
            Order summary
          </h3>
          <div class="confirmation-page__table">
            <div class="confirmation-page__row">
              <div class="confirmation-page__col confirmation-page__col--header confirmation-page__col--item">
                Item
              </div>
              <div class="confirmation-page__col confirmation-page__col--header confirmation-page__col--quantity">
                Quantity
              </div>
              <div class="confirmation-page__col confirmation-page__col--header confirmation-page__col--price">
                Price
              </div>
            </div>
            <div class="confirmation-page__products">
              <div class="confirmation-page__row" 
                v-for="cartItem in currentCustomer.cart.items"
                :key="cartItem.item_id"
                >
                <div class="confirmation-page__col confirmation-page__col--item">
                  {{ cartItem.color }} {{ cartItem.product.name}} - {{ cartItem.size }}
                </div>
                <div class="confirmation-page__col confirmation-page__col--quantity">
                  {{ cartItem.quantity }}
                </div>
                <div class="confirmation-page__col confirmation-page__col--price">
                  {{ formatPrice(getItemPrice(cartItem)) }}
                </div>
                </div>
              </div>
            </div>
        </div>
        <div class="confirmation-page__delivery">
          <h3 class="confirmation-page__header">
            Delivery
          </h3>
          <div class="confirmation-page__address">
            <h4>Address</h4>
            <div class="confirmation-page__address-line">
              {{ address.line1 }}
            </div>
            <div class="confirmation-page__address-line">
              {{ address.line2 }}
            </div>
          </div>
          <div class="confirmation-page__shipping">
            <h4>Delivery options</h4>
            <div>
              {{ shippingType.shipping_type }}
            </div>
          </div>
        </div>
      </div>
      <div class="confirmation-page__totals">
        <div class="confirmation-page__total">
          <h3>Subtotal</h3>
          {{ formatPrice(cartTotal) }}
        </div>
        <div class="confirmation-page__total">
          <h3>Shipping</h3>
          {{ shippingType && formatPrice(shippingType.shipping_cost) }}
        </div>
        <div class="confirmation-page__total confirmation-page__total--grand">
          <h3>Grand total</h3>  
          {{ shippingType && formatPrice(cartTotal, shippingType.shipping_cost)}}
        </div>
      </div>
    </div>
    <CheckoutButtons @submit="submit" @cancel="cancel" />
  </div>
</template>

<script>
import { GET_SHIPPING_TYPE, GET_CURRENT_CUSTOMER} from '@/apollo/operations'
import CheckoutButtons from './CheckoutButtons'
export default {
  components: { CheckoutButtons },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.$emit('cancel')
    },
    getItemPrice (item) {
      return ((parseFloat(item.product.price) * 100 * item.quantity)/ 100).toFixed(2)
    },
    formatPrice (...prices) {
      return '£' + prices.reduce((acc, curr) => acc + parseFloat(curr), 0)
    }
  },
  computed: {
    cartTotal () {
      return this.currentCustomer.cart.items.reduce((cur, inc) => {
        return cur + parseFloat(this.getItemPrice(inc))
      }, 0).toFixed(2)
    },
    address () {
      return {
            line1: this.currentCustomer.address.address + ', ' +
                   this.currentCustomer.address.city + ', ',
            line2: this.currentCustomer.address.state + ', ' +
                   this.currentCustomer.address.zipCode + ', ' +
                   this.currentCustomer.address.shippingRegion.shipping_region
      }
    }
  },
  apollo: {
    shippingType () {
      return {
        query: GET_SHIPPING_TYPE
      }
    },
    currentCustomer () {
      return {
        query: GET_CURRENT_CUSTOMER
      }
    }
  }
}
</script>

<style lang="scss">
@import '~#/abstracts/variables';
.confirmation-page {
  display: flex;
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__details {
    display: flex;
    justify-content: space-between;
    flex: 1;
    border-bottom: 2px solid $color-gray-light;

    h4 {
      color: $color-gray-light-2;
      margin-bottom: 1.5rem;
    }
  }
  &__totals {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  &__total {
    font-weight: 600;
    text-align: right;
    &:not(:first-child) {
      margin-left: 3rem;
    }
    &--grand {
      font-size: 2rem;
    }
    h3 {
      font-size: 1.4rem;
      color: $color-gray-light-2;
    }

  }
  &__header {
    margin-bottom: 1.3rem;
  }
  &__address {
    margin-bottom: 2rem;
  }
  &__summary {
    flex: 2;
    margin-right: 3rem;
  }
  &__delivery {
    flex: 1;
  }

  &__products {
    max-height: 29vh;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
  }

  &__row {
    padding: .5rem 1rem;
    display: flex;
    &:nth-child(even) {
      background-color: $color-off-white;
    }
  }
  &__col {
    display: flex;
    justify-content: center;
    flex: 1;

    &--item {
      flex: 4;
      justify-content: flex-start;
    }

    &--price {
      font-weight: 600;
      color: $color-red;
    }

    &--header {
      font-weight: 600;
      color: $color-gray-light-2;
    }
  }
}
</style>
