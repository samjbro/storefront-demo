<template>
  <div class="order-form">
    <div class="order-form__attribute">
      <div class="order-form__subheader">Color</div>
      <div class="order-form__option">
        <label
          class="order-form__color"
          v-for="color in colors"
          :for="color.attribute_value"
          :key="color.attribute_value_id"  
        >
          <input :id="color.attribute_value" type="radio" v-model="shirtColor" :value="color.attribute_value">
          <span :class="`u-bg-shirt-color--${color.attribute_value.toLowerCase()}`"></span>
        </label>
      </div>
    </div>
    <div class="order-form__attribute">
      <div class="order-form__subheader">Size</div>  
      <div class="order-form__option">
        <label
          class="order-form__size"
          :class="{'order-form__size--selected': size.attribute_value === shirtSize}"
          v-for="size in sizes"
          :for="size.attribute_value"
          :key="size.attribute_value_id"  
        >
          <input 
            :id="size.attribute_value" 
            type="radio" 
            v-model="shirtSize" 
            :value="size.attribute_value">
          <span>{{ size.attribute_value }}</span>
        </label>
      </div>
    </div>
    <div class="order-form__attribute">
      <div class="order-form__subheader">Quantity</div>
      <QuantityInput :quantity="shirtQuantity" @increment="incrementQuantity" />
    </div>
    <div class="order-form__actions">
      <button class="button" @click="addToCart" :class="{'button--inactive': productInCart}">
        <span v-if="addingToCart">
          <fa-icon :icon="['fas', 'spinner']" spin />
        </span>
        <span v-else-if="productInCart">Already in cart</span>
        <span v-else>Add to cart</span>
      </button>
      <button class="button order-form__cart" @click="showCart">
        View cart
      </button>
    </div>
  </div>
</template>

<script>
import { ADD_TO_CART, GET_CURRENT_CUSTOMER, SHOW_OVERLAY } from '@/apollo/operations'
import QuantityInput from '@/components/shared/QuantityInput'
export default {
  components: { QuantityInput },
  props: {
    product: Object
  },
  data () {
    return {
      shirtColor: 'White',
      shirtSize: 'M',
      shirtQuantity: 1,
      addingToCart: 0
    }
  },
  computed: {
    colors () {
      return this.product.attributes.filter(attr => {
        return attr.attribute_name === 'Color'
      })
    },
    sizes () {
      return this.product.attributes.filter(attr => {
        return attr.attribute_name === 'Size'
      })
    },
    attributeString () {
      return this.shirtSize + ', ' + this.shirtColor
    },
    productInCart () {
      return this.currentCustomer.cart.items.find(item => {
        const shirtInCart = item.product.product_id === this.product.product_id
        const sizeInCart = item.size === this.shirtSize
        const colorInCart = item.color === this.shirtColor
        return shirtInCart && sizeInCart && colorInCart
      })
    }
  },
  methods: {
    incrementQuantity (direction) {
      if (this.shirtQuantity + direction < 1) return
      this.shirtQuantity += direction;
    },
    async addToCart () {
      if (this.productInCart) return
      this.addingToCart++
      try {
        console.log({
          shirtColor: this.shirtColor,
          shirtSize: this.shirtSize
        })
        await this.$apollo.mutate({
          mutation: ADD_TO_CART,
          variables: {
            data: {
              product_id: parseInt(this.product.product_id),
              cart_id: this.currentCustomer.cart.cart_id,
              attributes: this.shirtSize + ', ' + this.shirtColor,
              quantity: this.shirtQuantity
            }
          },
          update: (cache, { data: { addToCart }}) => {
            console.log(addToCart)
            this.currentCustomer.cart.items.unshift(addToCart)
            cache.writeQuery({ query: GET_CURRENT_CUSTOMER, data: {
              currentCustomer: this.currentCustomer
            }})
          }
        }) 
        this.addingToCart--
      } catch (e) {
        this.addingToCart--
        throw new Error(e)
      }
    },
    showCart () {
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: {
          view: 'cart'
        }
      })
    },
  },
  apollo: {
    currentCustomer () {
      return {
        query: GET_CURRENT_CUSTOMER
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.order-form {
   &__option {
    display: flex;
    margin-bottom: 1.5rem;
  }
  &__subheader {
    color: $color-gray-med;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  &__color {
    position: relative;
    height: 2.3rem;
    width: 2.3rem;
    cursor: pointer;
    input[type="radio"] {
      -webkit-appearance: none;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      outline: none;

      &:checked {
        border: 1px solid $color-red;
      }
    }
    span {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      transform: scale(.6);
      // z-index: 1;
      border-radius: 50%;
    }
  }
  &__size {
    position: relative;
    height: 2.3rem;
    width: 5.3rem;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 1rem;
    }

    input[type="radio"] {
      -webkit-appearance: none;
      width: 100%;
      height: 100%;
      outline: none;
      background-color: $color-gray-light;
      color: $color-black;

    }
    &--selected {
      color: $color-white;
      background-color: $color-gray-light;
      input[type="radio"] {
        background-color: $color-red;
      }
    }
    span {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
      display: flex;
      justify-content: center; 
      align-items: center;
    }
  }

  &__actions {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;

    & > * {
      &:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }

  &__wishlist {
    flex: 1;
    text-align: center;
  }
}
</style>
