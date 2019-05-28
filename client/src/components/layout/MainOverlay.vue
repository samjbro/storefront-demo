<template>
  <transition name="main-overlay--transitioning">
  <div class="main-overlay" v-show="overlay.showing">
    <transition name="main-overlay__panel--transitioning">
    <div 
      class="main-overlay__panel"
      :class="[isLarge ? 'main-overlay__panel--large' : 'main-overlay__panel--small']"
      v-if="overlay.showing"
      >
  <!-- v-on-clickaway="close"
    > -->
      <div class="main-overlay__exit" @click="close"></div>
      <div class="main-overlay__content">

        <RegisterForm v-if="overlay.view === 'register'" />
        <LoginForm v-if="overlay.view === 'login'" />
        <ContactForm v-if="overlay.view === 'contact'" />
        <ProductView v-if="overlay.view === 'product'" />
        <ShoppingCart v-if="overlay.view === 'cart'" />
        <CheckoutView v-if="overlay.view === 'checkout'" />

      </div>
    </div>
    </transition>
  </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { apolloClient } from '@/apollo'
import { GET_OVERLAY, CLOSE_OVERLAY } from '@/apollo/operations'
import RegisterForm from '@/components/forms/RegisterForm'
import LoginForm from '@/components/forms/LoginForm'
import ContactForm from '@/components/forms/ContactForm'
import ProductView from '@/components/products/ProductView'
import ShoppingCart from '@/components/cart/ShoppingCart'
import CheckoutView from '@/components/forms/checkout/CheckoutView'
export default {
  mixins: [clickaway],
  components: { RegisterForm, LoginForm, ContactForm, ProductView, ShoppingCart, CheckoutView },
  data () {
    return {
      largeViews: [
        'product', 'cart', 'checkout'
      ]
    }
  },
  methods: {
    close (){
      this.$apollo.mutate({
        mutation: CLOSE_OVERLAY
      })
    }
  },
  computed: {
    isLarge () {
      return this.largeViews.includes(this.overlay.view)
    }
  },
  apollo: {
    overlay () {
      return {
        query: GET_OVERLAY
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.main-overlay {
  background-color: rgba(0,0,0, .8);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  &__panel {
    background: $color-white;
    padding: 4rem 3rem 2rem 3rem;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 1rem #000;

    &--large {
      width: 90%;
      height: 85%;
      
      @include respond(phone) {
        width: 100%;
        height: 100%;
      }
    }

    &--transitioning {
      &-enter-active,
      &-leave-active {
        transition: transform .5s;
      }
      &-enter,
      &-leave-to {
        transform: translateY(-100vh);
      }
    }
  }
  &__content {
    height: 100%;
    width: 100%;
  }

  &__exit {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 2.6rem;
    height: 2.6rem;
    cursor: pointer;
    &:hover {
      &:before,
      &:after {
        background-color: red;
      }
    }

    &:before,
    &:after {
      position: absolute;
      content: "";
      width: 100%;
      height: 2px;
      top: 50%;
      left: 0;
      background-color: black;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }

  &--transitioning {
    &-enter-active,
    &-leave-active {
      transition: opacity .5s;
    }
    &-enter,
    &-leave-to {
      opacity: 0;
    }
  }
}
</style>
