<template>
  <div class="quantity-input" :class="{'quantity-input--disabled': disabled}">
    <button class="quantity-input__increment" @click="!disabled && $emit('increment', -1)">
      <fa-icon :icon="['fas', 'minus']"/>
    </button>
    <div class="quantity-input__indicator">{{ quantity }}</div>
    <button class="quantity-input__increment" @click="!disabled && $emit('increment', 1)">
      <fa-icon :icon="['fas', 'plus']"/>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    quantity: Number,
    disabled: Boolean
  }
};
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.quantity-input {
  display: flex;
  height: 3.5rem;
  &--disabled {
    * {
      color: $color-gray-med;
      cursor: initial !important;
    }
  }
  @include respond(phone) {
    height: 2.5rem;
  }
  & > * {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
  &__increment {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3.5rem;
    height: 100%;
    width: 3.5rem;
    border-radius: 50%;
    background-color: $color-gray-light;
    border: none;
    outline: none;
    cursor: pointer;
    @include respond(phone) {
      height: 2.5rem;
      width: 2.5rem;
    }
    svg {
      font-size: 1.5rem;
      color: $color-black;
    }
    &:active {
      border: 1px solid $color-red;
    }
  }
  &__indicator {
    width: 5rem;
    @include respond(phone) {
      width: 2.5rem;
    }
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5rem;
    border: 1px solid $color-gray-light;
    font-weight: 600;
    font-size: 1.4rem;
    background-color: $color-white;
  }
}
</style>
