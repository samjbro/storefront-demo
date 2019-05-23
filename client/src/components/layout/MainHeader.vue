<template>
  <div class="main-header">
    <div class="main-header__user">
      <div v-if="currentCustomer">
        <span>Hello, {{ currentCustomer.name }}!</span>
        <a @click.prevent="logout">Log out</a>
      </div>
      <div v-else>
        <span>Hi! </span>
        <a @click.prevent="showOverlay('login')">Sign in</a>
         or 
        <a @click.prevent="showOverlay('register')">Register</a>
      </div>
    </div>
    <div class="main-header__links">
      <a @click.prevent="">Daily Deals</a>
      <a @click.prevent="">Sell</a>
      <a @click.prevent="showOverlay('contact')">Help & Contact</a>
    </div>
    <div class="main-header__currency">
      <img src="~img/gbr.svg" alt="GBP">
      £ GBP
    </div>
    <div class="main-header__checkout" @click="showOverlay('cart')">
      <div class="main-header__bag">
        <img src="~img/icons-bag.svg" alt="Bag">
        <div class="main-header__bag-number">{{ currentCustomer ? currentCustomer.cart.items.length : 0 }}</div>
      </div>
      <div>Your bag: {{ currentCustomer ? '£3.99' : '£0.00' }}</div>
    </div>
  </div>
</template>

<script>
import { apolloClient } from '@/apollo'
import { GET_CURRENT_CUSTOMER, SHOW_OVERLAY } from '@/apollo/operations'
export default {
  methods: {
    showOverlay (view) {
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: {
          view
        }
      })
    },
    logout () {
      apolloClient.resetStore()
      localStorage.clear() 
    }
  },
  computed: {
    cartTotal () {
      return this.currentCustomer ? '£3.99' : '£0.00'
    }
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
@import '~#/abstracts/variables';
.main-header {
  display: flex;
  font-weight: 600;
  background-color: $color-white;
  padding: 1.2rem 1.8rem;
  justify-content: space-between;
  align-items: center;
  &__user {
    a,
    a:link,
    a:visited {
      color: $color-red;
    }
  }

  &__links {
    display: flex;
    justify-content: space-evenly;
  }

  &__user {
    // flex: 1;
    min-width: 15rem;
  }

  &__links {
    & > * {
      &:not(:last-child) {
        margin-right: 3rem;
      }
    }
    // flex: 2;
  }

  &__currency {
    display: flex;
    align-items: center;

    img {
      margin-right: 1rem;
    }
  }

  &__checkout {
    display: flex; 
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: $color-red;
    }
    &:active {
      color: rgba($color-red, .7);
    }
  }

  &__bag {
    position: relative;
    margin-right: 1.5rem;
  }

  &__bag-number {
    position: absolute;
    top: 0;
    transform: translate(45%, -45%);
    background: $color-red;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
}
</style>
