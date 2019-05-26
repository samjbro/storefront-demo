<template>
  <div class="product-reviews">
    <div class="product-reviews__header">
      <span v-show="addReview">Add a review</span>
      <span v-show="!addReview">Product reviews</span>
    </div>
    <ReviewForm class="product-reviews__form" v-if="addReview" @close="addReview = false" />
    <div class="product-reviews__content" v-show="!addReview">
      <div class="product-reviews__reviews">
        <ProductReview
          v-for="review in reviews"
          :key="review.review_id"
          :review="review"
        />
      </div>
      <div class="product-reviews__add">
        <a @click.prevent="currentCustomer ? addReview = true : showOverlay('login')">
          Add a review
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { SHOW_OVERLAY, GET_CURRENT_CUSTOMER } from '@/apollo/operations'
import ProductReview from './ProductReview'
import ReviewForm from '@/components/forms/ReviewForm'
export default {
  components: { ProductReview, ReviewForm },
  props: {
    reviews: Array
  },
  data () {
    return {
      addReview: false
    }
  },
  methods: {
    showOverlay (view) {
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: {
          view
        }
      })
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
@import "~#/abstracts/variables";
.product-reviews {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__header {
    font-size: 2rem;
    font-weight: 600;
    padding-bottom: 1rem;
  border-bottom: 1px solid $color-gray-light;
    // flex: 1;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  &__form {
    flex: 1;
  }
  &__reviews {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    flex: 5;
    // border-top: 1px solid $color-gray-light;
    // border-bottom: 1px solid $color-gray-light;
  }
  &__add {
    flex: 1;
    color: $color-red;
    font-size: 1.6rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
