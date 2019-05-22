<template>
  <div class="review-form">
    <div class="review-form__fields">
      <div class="review-form__field review-form__field--review">
        <label for="review">Your review</label>
        <textarea name="review" id="review" cols="30" rows="10" v-model="review"
          class="review-form__input"></textarea>
      </div>
      <div class="review-form__field review-form__field--rating">
        <label>Overall rating</label>
        <StarRating 
          :rating="rating" 
          :isInteractive="true" 
          @update="updateRating"
          class="review-form__input"
        />
      </div>
    </div>
    <div class="review-form__buttons">
      <a class="button review-form__button" @click.prevent="submit">Submit</a>
      <a class="button review-form__button" @click.prevent="$emit('close')">Cancel</a>
    </div>
  </div>
</template>

<script>
import { ADD_REVIEW, GET_PRODUCT, GET_CURRENT_PRODUCT, GET_CURRENT_CUSTOMER } from '@/apollo/operations'
import StarRating from '@/components/shared/StarRating'
export default {
  components: { StarRating },
  data () {
    return {
      review: '',
      rating: 0
    }
  },
  methods: {
    updateRating (num) {
      num = parseInt(num)
      this.rating = this.rating === num
        ? 0
        : num
    },
    async submit () {
       await this.$apollo.mutate({
        mutation: ADD_REVIEW,
        variables: {
          data: {
            review: this.review,
            rating: this.rating,
            product_id: this.currentProduct.product_id
          }
        },
        update: (cache, { data: { addReview } }) => {
          const data = cache.readQuery({ 
            query: GET_PRODUCT,
            variables: {
              id: this.currentProduct.product_id
            }
          })
          addReview.__typename = 'Review'
          addReview.name = this.currentCustomer.name
          data.product.reviews.unshift(addReview)
          cache.writeQuery({ query: GET_PRODUCT, data})
          cache.writeQuery({ query: GET_CURRENT_PRODUCT, data: {
            currentProduct: data.product
          }})
        }
      })

      this.$emit('close')
    }
  },
  apollo: {
    currentProduct () {
      return {
        query: GET_CURRENT_PRODUCT
      }
    },
    currentCustomer (){
      return {
        query: GET_CURRENT_CUSTOMER
      }
    }
  }
}
</script>

<style lang="scss">
@import '~#/abstracts/variables';
.review-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2rem;

  &__fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__field {
    display: flex;
    label {
      flex: 1;
      font-weight: 600;
    }
    input,
    textarea {
      border-radius: .3rem;
      border: 1px solid $color-gray-light;
    }
  }
  &__input {
    flex: 2;
  }
  &__buttons {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }
  &__button {
    font-size: 1.2rem;
    padding: 1rem 1.4rem;
    width: auto;
    margin: 0;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}
</style>

