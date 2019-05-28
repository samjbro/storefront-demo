<template>
  <div class="product-review">
    <div class="product-review__info">
      <StarRating class="product-review__rating" :rating="review.rating" />
      <div class="product-review__name">
        {{ review.name }}
      </div>
      <div class="product-review__time">
        {{ createdOn }}
      </div>
    </div>
    <div class="product-review__content">
      <div class="product-review__review">
        {{ review.review }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import StarRating from '@/components/shared/StarRating'
export default {
  components: { StarRating },
  props: {
    review: Object
  },
  computed: {
    createdOn () {
      return moment(this.review.created_on).fromNow()
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.product-review {
  display: flex;
  width: 100%;
  min-height: 10rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid $color-gray-light;

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 1rem;
  }
  &__rating {
    margin-bottom: 1rem;

  }
  &__name {
    font-size: 1.2rem;
    font-weight: 600;
  }
  &__time {
    font-size: 1rem;
    color: $color-gray-med;
  }
  &__content {
    flex: 3;
    display: flex;
    padding-top: 1rem;
    // align-items: center;

  }
  &__review {
    color: $color-gray-med;
    // font-size: 1.6rem;
    font-family: 'OpenSans-Light', sans-serif;
  }
}
</style>
