<template>
  <div class="checkout-buttons">
    <div v-if="!last" class="button checkout-buttons__cancel" @click="$emit('cancel')">
      Back
    </div>
    <div class="button checkout-buttons__submit" @click="$emit('submit')">
      <fa-icon v-if="submitting" :icon="['fas', 'spinner']" spin />
      <template v-else>
        <slot name="submitText" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    last: Boolean,
    submitting: Number
  }  
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.checkout-buttons {
  display: flex;
  
  &__cancel {
    background-color: $color-white;
    color: $color-red;
    border: 2px solid $color-red;
  }
}
</style>

