<template>
  <div class="payment-form" :class="{'payment-form--failed': error}">
    <div class="payment-form__content">
      <div class="payment-form__row">
        <div class="payment-form__method">
          <div class="payment-form__method-images">
            <img src="~img/visa.svg" alt="visa">
            <img src="~img/mastercard.svg" alt="mastercard">
          </div>
          <div class="payment-form__method-selection">
            <input
              type="radio"
              id="visa"
              v-model="paymentMethod"
              :value="paymentMethod"
              :checked="paymentMethod === 'visa'"
            >
            <label for="visa">Pay {{ formatPrice(cartTotal) }} with credit card</label>
          </div>
        </div>
        <div class="payment-form__method">
          <div class="payment-form__method-images">
            <img src="~img/PayPal.svg" alt="PayPal">
          </div>
          <div class="payment-form__method-selection">
            <input type="radio" id="paypal" disabled>
            <label for="paypal">Pay {{ formatPrice(cartTotal) }} with PayPal (coming soon)</label>
          </div>
        </div>
      </div>
      <div class="payment-form__row">
        <div class="payment-form__inputs">
          <div class="payment-form__input-row">
            <div class="payment-form__input">
              <label for="name">Cardholder's Name</label>
              <input type="text" id="name" v-model="cardData.cardholderName" required>
            </div>
            <div class="payment-form__input">
              <label for="number">Card Number</label>
              <input type="password" id="number" v-model="cardData.cardNumber" required>
            </div>
          </div>
          <div class="payment-form__input-row">
            <div class="payment-form__input">
              <label for="expiration">Valid thru</label>
              <input type="string" v-model="cardData.expiryDate" placeholder="MM/YY" required>
            </div>
            <div class="payment-form__input">
              <label for="cvc">CVV / CVC *</label>
              <input type="number" v-model="cardData.CVC" required>
            </div>
            <div
              class="payment-form__description"
            >* CVV or CVC is the card security code, unique three digits number on the back of your card separate from its number.</div>
          </div>
        </div>
      </div>
      <div class="payment-form__error">{{ error }}</div>
    </div>
    <CheckoutButtons
      @submit="submit"
      @cancel="cancel"
      :submitting="submitting"
      class="payment-form__buttons"
    >
      <template v-slot:submitText>
        <span>Pay</span>
      </template>
    </CheckoutButtons>
  </div>
</template>

<script>
import {
  CREATE_ORDER,
  GET_SHIPPING_TYPE,
  GET_CURRENT_CUSTOMER,
  GET_NEW_CART
} from "@/apollo/operations";
import hasCartTotal from "./hasCartTotal";
import CheckoutButtons from "./CheckoutButtons";

export default {
  mixins: [hasCartTotal],
  components: { CheckoutButtons },
  data() {
    return {
      paymentMethod: "visa",
      cardData: {
        cardholderName: "",
        cardNumber: "",
        CVC: "",
        expiryDate: ""
      },
      submitting: 0,
      error: null
    };
  },
  methods: {
    async submit() {
      try {
        this.submitting++;
        await this.$apollo.mutate({
          mutation: CREATE_ORDER,
          variables: {
            data: {
              cartId: this.currentCustomer.cart.cart_id,
              shippingId: this.shippingType.shipping_id,
              cardData: this.cardData
            }
          },
          update: async (cache, { data: { createOrder } }) => {
            const {
              data: { getNewCart }
            } = await this.$apollo.mutate({
              mutation: GET_NEW_CART,
              variables: {
                customerId: this.currentCustomer.customer_id
              }
            });
            this.currentCustomer.cart = getNewCart;
            cache.writeQuery({
              query: GET_CURRENT_CUSTOMER,
              data: {
                currentCustomer: this.currentCustomer
              }
            });
          }
        });
        this.submitting--;
        this.$emit("submit");
      } catch (e) {
        this.submitting--;
        this.error = e.message;
        setTimeout(() => {
          this.error = null;
        }, 2000);
        console.log(e);
      }
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  apollo: {
    shippingType() {
      return {
        query: GET_SHIPPING_TYPE
      };
    }
  }
};
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
@import "~#/abstracts/animations";
.payment-form {
  $center-margin-width: 2rem;
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex: 1;
  }
  &__method {
    flex: 1;
    border: 1px solid $color-blue;
    border-radius: 0.2rem;
    background-color: $color-off-white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem;

    justify-content: center;
    margin-bottom: 3rem;

    &:not(:last-child) {
      margin-right: $center-margin-width;
    }

    @include respond(phone) {
      max-width: 50%;
      margin-bottom: 1rem;
    }
  }
  &__method-images {
    display: flex;
    align-items: center;
    margin-bottom: 2.5rem;

    @include respond(phone) {
      margin-bottom: 1.5rem;
    }

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
      margin-right: 0.7rem;
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
      margin-bottom: 0.5rem;
    }

    input {
      &:not(:last-child) {
        margin-bottom: 0.8rem;
      }
      // width: 100%;
      padding: 1.2rem 2rem;
      // min-width: 30rem;
      border-radius: 0.4rem;
      border: 1px solid $color-gray-light-2;
      font-size: 1.4rem;

      &[type="month"] {
        width: 100%;
      }
    }

    &--missing {
      input {
        background-color: rgba($color-red, 0.2);
      }
    }
  }
  &__input-row {
    flex: 1;
    display: flex;
    align-items: center;
    @include respond(phone) {
      display: block;
    }
  }
  &__inputs {
    flex: 2;
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
  }
  &__description {
    margin-top: 1.5rem;
    max-width: 49%;
    @include respond(phone) {
      max-width: 100%;
    }
  }
  &__row {
    display: flex;
    justify-content: center;
  }
  &__buttons {
    flex-shrink: 0;
  }
  &__error {
    min-height: 3rem;
    color: $color-red;
    text-align: center;
  }
  &--failed {
    animation: shake 0.5s;
  }
}
</style>
