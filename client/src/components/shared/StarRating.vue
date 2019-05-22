<template>
  <div class="star-rating">
    <div v-if="rating === null" class="star-rating__stars">No rating yet!</div>
    <div v-else class="star-rating__stars">
      <div 
        v-for="num in 5" 
        :key="num" 
        class="star-rating__star-wrapper"
        :class="{'star-rating__star-wrapper--interactive': isInteractive}"
        @click="isInteractive && $emit('update', num)"
      >
        <div class="star-rating__star">
          <img src="~img/star-gray.svg" alt="empty-star">
        </div>
        <div class="star-rating__star star-rating__star--full"
          :class="{
            'star-rating__star--visible': rating + 0.5 >= num,
            'star-rating__star--half': rating === num - 0.5,
          }">
          <img src="~img/star-gold.svg" alt="full-star">
        </div>
      </div>
    </div>
    <div class="star-rating__link">
      <slot name="link" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: Number,
    isInteractive: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.star-rating {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 600;

  &__link {
    color: $color-red;
    // font-size: 1.4;
  }
  &__stars {
    display: flex;
    margin-right: 2rem;
  }
  &__star-wrapper {
    position: relative;
    &--interactive {
      cursor: pointer;
    }
  }
  &__star {
    &--full {
      display: none;
      position: absolute;
      top: 0;
    }
    &--visible {
      display: block; 
    }
    &--half {
      -webkit-clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%);
      clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%);
    }
  }
}
</style>
