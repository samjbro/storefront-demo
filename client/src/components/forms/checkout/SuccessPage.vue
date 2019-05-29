<template>
  <div class="success-page">
    <div class="success-page__content">
      <div class="success-page__image">
        <img src="~img/rocket.svg" alt="Success!">
      </div>
      <h1 class="success-page__title">Success!</h1>
      <div class="success-page__message">
        Your items will be shipped shortly, and you will receive an email with the details.
      </div>
    </div>
    <CheckoutButtons @submit="submit" :last="true">
      <template v-slot:submitText>
        <span>Back to shop</span>
      </template>
    </CheckoutButtons>
  </div>
</template>

<script>
import CheckoutButtons from './CheckoutButtons'
export default {
  components: { CheckoutButtons },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.success-page {
  // height: 100%;
  
  &__content {
    flex: 1;
    margin: 0 auto;
    max-width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    @include respond(phone) {
      max-width: 100%;;
    }
  }
  &__image {
    margin-bottom: 2rem;
    img {
      max-width: 100%;
    }
  }
  &__title {
    font-size: 4.8rem;
    font-family: PlayfairDisplay,serif;
    font-weight: 600;
    margin-bottom: 1rem;
    @include respond(phone) {
      font-size: 7rem;
    }
  }
  &__message {
    line-height: 2rem;
    color: $color-gray-med;
    text-align: center;
    margin-bottom: 1rem;
    @include respond(phone) {
      font-size: 2.5rem;
      width: 100%;

    }
  }
}
</style>

