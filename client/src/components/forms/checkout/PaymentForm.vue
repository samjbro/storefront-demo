<template>
  <div class="payment-form">
    <div class="payment-form__content">
      <div class="payment-form__col">
        <div class="payment-form__method">
          <div class="payment-form__method-images">
            <img src="~img/visa.svg" alt="visa">
            <img src="~img/mastercard.svg" alt="mastercard">
          </div>
          <div class="payment-form__method-selection">
            <input type="radio" id="visa" :model="paymentMethod" :value="paymentMethod" :checked="paymentMethod === 'visa'">
            <label for="visa">Pay {{ formatPrice(cartTotal) }} with credit card</label>
          </div>
        </div>
        <div class="payment-form__inputs">
          <div class="payment-form__input-row">
            <div class="payment-form__input">
              <label for="name">Cardholder's Name</label>
              <input type="text" id="name" :model="cardData.cardholderName" :value="cardData.cardholderName" disabled>
            </div>
          </div>
          <div class="payment-form__input-row">
            <div class="payment-form__input">
              <label for="expiration">Valid thru</label>
              <input type="month" @input="setExpiryDate" :value="cardData.expiryDate" disabled>
            </div>
            <div class="payment-form__input">
              <label for="cvc">CVV / CVC *</label>
              <input type="number" :model="cardData.CVC" :value="cardData.CVC" disabled>
            </div>
          </div>
        </div>
      </div>
      <div class="payment-form__col">
        <div class="payment-form__method">
          <div class="payment-form__method-images">
            <img src="~img/PayPal.svg" alt="PayPal">
          </div>
          <div class="payment-form__method-selection">
            <input type="radio" id="paypal" disabled>
            <label for="paypal">Pay {{ formatPrice(cartTotal) }} with PayPal (coming soon)</label>
          </div>
        </div>
        <div class="payment-form__inputs">
          <div class="payment-form__input-row">
            <div class="payment-form__input">
              <label for="number">Card Number</label>
              <input type="password" id="number" :model="cardData.cardNumber" :value="cardData.cardNumber" disabled>
            </div>
          </div>
          <div class="payment-form__input-row">
            <div class="payment-form__description">
              * CVV or CVC is the card security code, unique three digits number on the back of your card separate from its number.
            </div>
          </div>
        </div>
      </div>
    </div>
    <CheckoutButtons @submit="submit" @cancel="cancel" :submitting="submitting">
      <template v-slot:submitText>
        <span>Pay</span>
      </template>
    </CheckoutButtons>
    </div>
</template>

<script>
import { CREATE_ORDER, GET_SHIPPING_TYPE, GET_CURRENT_CUSTOMER } from '@/apollo/operations'
import hasCartTotal from './hasCartTotal'
import CheckoutButtons from './CheckoutButtons'

export default {
  mixins: [hasCartTotal],
  components: { CheckoutButtons },
  data () {
    return {
      paymentMethod: 'visa',
      cardData: {
        cardholderName: 'Test User',
        cardNumber: '4242424242424242',
        CVC: '123',
        expiryDate: '2020-12'
      },
      submitting: 0
    }
  },
  methods: {
    async submit () {
      try {
        this.submitting++
        await this.$apollo.mutate({
          mutation: CREATE_ORDER,
          variables: {
              data: {
                cartId: this.currentCustomer.cart.cart_id,
                shippingId: this.shippingType.shipping_id,
                cardData: this.cardData
            }
          },
          update: (cache, { data: { createOrder }}) => {
            this.currentCustomer.cart.items = createOrder
            cache.writeQuery({ query: GET_CURRENT_CUSTOMER, data: {
              currentCustomer: this.currentCustomer
            }})
          }
        })
        this.submitting--
        this.$emit('submit')
      } catch (e) {
        this.submitting--
        console.log(e)
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    setExpiryDate (e) {
      this.cardData.expiryDate = e.target.value
    }
  },
  apollo: {
    shippingType () {
      return {
        query: GET_SHIPPING_TYPE
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.payment-form {
  &__content {
    display: flex;
    flex: 1;
  }
  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    &:not(:last-child) {
      margin-right: 2.5rem;
    }
  }
  &__method {
    flex: 1;
    border: 1px solid $color-blue;
    border-radius: .2rem;
    background-color: $color-off-white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem;

    justify-content: center;
    margin-bottom: 3rem;

    @include respond(phone) {
      max-width: 50%;
    }
  }
  &__method-images {
    display: flex;
    align-items: center;
    margin-bottom: 2.5rem;

    img {
      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }
  }
  &__method-selection {
    label {
      font-weight: 600;
    }
    input {
      margin-right: .7rem;
    }
  }

  &__row {
    display: flex;
  }

  &__input {
    flex: 1;
    // flex-shrink: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:not(:last-child) {
      margin-right: 1.5rem;
    }

    label {
      color: $color-gray-med;
      font-weight: 600;
      font-size: 1.2rem;
      margin-bottom: .5rem;
    }
        
    input {
      &:not(:last-child) {
        margin-bottom: .8rem;
      }
      // width: 100%;
      padding: 1.2rem 2rem;
      // min-width: 30rem;
      border-radius: .4rem;
      border: 1px solid $color-gray-light-2;
      font-size: 1.4rem;
    }
    
    &--missing {
      input {
        background-color: rgba($color-red, .2);
      }
    }
  }
  &__input-row {
    flex: 1;
    display: flex;
    align-items: center;
  }
  &__inputs {
    flex: 2;
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
  }
  &__description {
    margin-top: 1.5rem;
  }
}
</style>
