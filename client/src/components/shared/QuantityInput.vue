<template>
  <div class="quantity-input">
    <button class="quantity-input__increment" @click="$emit('increment', -1)">
      <fa-icon :icon="['fas', 'minus']" />
    </button>
    <div class="quantity-input__indicator">{{ quantity }}</div>
    <button class="quantity-input__increment" @click="$emit('increment', 1)">
      <fa-icon :icon="['fas', 'plus']" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    quantity: Number
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.quantity-input {
  display: flex;
  height: 3.5rem;
  & > * {
    &:not(:last-child) {
      margin-right: .5rem;
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
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5rem;
    border: 1px solid $color-gray-light;
    font-weight: 600;
    font-size: 1.4rem;
  }

}
</style>
