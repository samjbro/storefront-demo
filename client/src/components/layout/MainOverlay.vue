<template>
  <transition name="main-overlay--transition">
  <div class="main-overlay" v-show="overlay.showing">
    <transition name="main-overlay__panel--transition">
    <div 
      class="main-overlay__panel"
      v-show="overlay.showing"
      >
  <!-- v-on-clickaway="close"
    > -->
      <div class="main-overlay__exit" @click="close"></div>
      <div class="main-overlay__content">

        <RegisterForm v-if="overlay.view === 'register'" />
        <LoginForm v-if="overlay.view === 'login'" />
        <ContactForm v-if="overlay.view === 'contact'" />
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
export default {
  mixins: [clickaway],
  components: { RegisterForm, LoginForm, ContactForm },
  methods: {
    close (){
      this.$apollo.mutate({
        mutation: CLOSE_OVERLAY
      })
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
.main-overlay {
  background-color: rgba(0,0,0, .8);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &__panel {
    background: #fff;
    padding: 4rem 3rem 2rem 3rem;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 1rem #000;

    &--transition {
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

  &--transition {
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
