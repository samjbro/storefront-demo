<template>
  <div class="product-view">
    <div class="product-view__loading" v-if="isLoading || !currentProduct">
      <fa-icon :icon="['fas', 'spinner']" spin />
    </div>
    <div class="product-view__arrow product-view__arrow--left" @click="getProduct(-1)">
      <fa-icon :icon="['fas', 'angle-left']" />
    </div>
    <div class="product-view__arrow product-view__arrow--right" @click="getProduct(1)">
      <fa-icon :icon="['fas', 'angle-right']" />
    </div>
    <template v-if="currentProduct">
      <div class="product-view__images">
        <div class="product-view__frame">
          <div class="product-view__image product-view__image--main">
            <img :src="getImgUrl(currentProduct[currentImage])" :alt="currentProduct.image">
          </div>
        </div>
        <div class="product-view__thumbnails">
          <div class="product-view__image product-view__image--thumb" @click="currentImage = 'image'">
            <img :src="getImgUrl(currentProduct.image)" :alt="currentProduct.image">
          </div>
          <div class="product-view__image product-view__image--thumb" @click="currentImage = 'image_2'">
            <img :src="getImgUrl(currentProduct.image_2)" :alt="currentProduct.image_2">
          </div>
        </div>
      </div>
      <div class="product-view__info">
        <div class="product-view__header">
          <h1 class="product-view__name">
            {{ currentProduct.name }}
          </h1>
          <div class="product-view__price">
            {{ formattedPrice }}
          </div>
          <StarRating
           :rating="averageRating" 
          >
            <template v-slot:link>
              <a @click.prevent="toggleReviews">
                <span v-if="showReviews">Back to the product</span>
                <span v-else>Read the reviews</span>
              </a>
            </template>
          </StarRating>
        </div>
        <ProductReviews 
          v-if="showReviews" 
          class="product-view__reviews" 
          @toggleReviews="toggleReviews" 
          :reviews="currentProduct.reviews"
          />
      
        <div v-else class="product-view__details">
          <div class="product-view__description">
            {{ currentProduct.description }}
          </div>
          <div>
            <div class="product-view__subheader">Color</div>
            <div class="product-view__option">
              <label
                class="product-view__color"
                v-for="color in colors"
                :for="color.attribute_value"
                :key="color.attribute_value_id"  
              >
                <input :id="color.attribute_value" type="radio" v-model="shirtColor" :value="color.attribute_value">
                <span :class="`u-bg-shirt-color--${color.attribute_value.toLowerCase()}`"></span>
              </label>
            </div>
          </div>
          <div>
            <div class="product-view__subheader">Size</div>  
            <div class="product-view__option">
              <label
                class="product-view__size"
                :class="{'product-view__size--selected': size.attribute_value === shirtSize}"
                v-for="size in sizes"
                :for="size.attribute_value"
                :key="size.attribute_value_id"  
              >
                <input 
                  :id="size.attribute_value" 
                  type="radio" 
                  v-model="shirtSize" 
                  :value="size.attribute_value">
                <span>{{ size.attribute_value }}</span>
              </label>
            </div>
          </div>
          <div>
            <div class="product-view__subheader">Quantity</div>
            <div class="product-view__quantity">
              <button class="product-view__increment" @click="incrementQuantity(-1)">
                <fa-icon :icon="['fas', 'minus']" />
              </button>
              <div class="product-view__indicator">{{ shirtQuantity }}</div>
              <button class="product-view__increment" @click="incrementQuantity(1)">
                <fa-icon :icon="['fas', 'plus']" />
              </button>
            </div>
          </div>
          <div class="product-view__actions">
            <button class="button product-view__buy">
              Add to cart
            </button>
            <div class="product-view__wishlist">
              Add to wishlist
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import StarRating from '@/components/shared/StarRating'
import ProductReviews from './ProductReviews'
import { GET_CURRENT_PRODUCT, GET_PRODUCT, SET_CURRENT_PRODUCT } from '@/apollo/operations'
export default {
  components: { StarRating, ProductReviews },
  data () {
    return {
      isLoading: 0,
      currentImage: 'image',
      shirtColor: null,
      shirtSize: null,
      shirtQuantity: 1,
      showReviews: false
    }
  },
  computed: {
    formattedPrice () {
      return '£' + this.currentProduct.price
    },
    colors () {
      return this.currentProduct.attributes.filter(attr => {
        return attr.attribute_name === 'Color'
      })
    },
    sizes () {
      return this.currentProduct.attributes.filter(attr => {
        return attr.attribute_name === 'Size'
      })
    },
    validReviews () {
      return this.currentProduct.reviews.filter(review => {
        return review.rating > -1 && review.rating < 6
      })
    },
    averageRating () {
      if (!this.validReviews.length) return null
      const total = this.validReviews
        .map(review => review.rating)
        .reduce((acc, cur) => acc + cur)
      const average = total / this.validReviews.length
      // Getting the nearest half integer
      return Math.round(average * 2) / 2
    }
  },
  methods: {
    getImgUrl (img) {
      return `https://backendapi.turing.com/images/products/${img}`
    },
    incrementQuantity (direction) {
      if (this.shirtQuantity + direction < 1) return
      this.shirtQuantity += direction;
    },
    toggleReviews () {
      this.showReviews = !this.showReviews
    },
    async getProduct (direction) {
      this.isLoading = true
      this.showReviews = false
      try {
        const { data } = await this.$apollo.query({
          query: GET_PRODUCT,
          variables: {
            id: (parseInt(this.currentProduct.product_id) + direction).toString()
          }
        })
        if (!data.product) return
        this.$apollo.mutate({
          mutation: SET_CURRENT_PRODUCT,
          variables: {
            product: data.product
          }
        })
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    }
  },
  apollo: {
    currentProduct () {
      return {
        query: GET_CURRENT_PRODUCT,
        loadingKey: 'isLoading'
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.product-view {
  display: flex;
  width: 80vw;
  height: 75vh;

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10rem;
    color: $color-gray-med;
    cursor: pointer;

    &:hover {
      color: $color-gray-light;
    }

    &--left {
      left: -10rem;
      left: -5rem;

    }
    &--right {
      right: -5rem;
    }
  }

  &__images {
    flex: 2;
    display: flex;
    flex-direction: column;
  }
  &__image {
    display: flex;
    justify-content: center;

    &--main {
      align-items: center;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        max-height: 50vh;
      }
    }
    &--thumb {
      &:not(:last-child) {
        margin-right: 2rem;
      }
      img {
        height: 9rem;
        width: 9rem;
        object-fit: cover;
      }
    }
  }
  &__frame {
    padding: 2rem 2.5rem;
    flex: 1;
  }
  &__thumbnails {
    display: flex;
    justify-content: center;
    padding-bottom: 3rem;

    img {
      cursor: pointer;
    }
  }

  &__reviews {
  }
  &__info {
    flex: 3;
    margin-left: 4rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__name {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    // margin-left: -2rem;
  }
  &__price {
    color: $color-red;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
 
  &__description {
    min-height: 8rem;
  }
  &__options {
    display: flex;

  }
  &__option {
    display: flex;
    margin-bottom: 1.5rem;
  }
  &__subheader {
    color: $color-gray-med;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  &__color {
    position: relative;
    height: 2.3rem;
    width: 2.3rem;
    cursor: pointer;
    input[type="radio"] {
      -webkit-appearance: none;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      outline: none;

      &:checked {
        border: 1px solid $color-red;
      }
    }
    span {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      transform: scale(.6);
      // z-index: 1;
      border-radius: 50%;
    }
  }
  &__size {
    position: relative;
    height: 2.3rem;
    width: 5.3rem;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 1rem;
    }

    input[type="radio"] {
      -webkit-appearance: none;
      width: 100%;
      height: 100%;
      outline: none;
      background-color: $color-gray-light;
      color: $color-black;

    }
    &--selected {
      color: $color-white;
      background-color: $color-gray-light;
      input[type="radio"] {
        background-color: $color-red;
      }
    }
    span {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
      display: flex;
      justify-content: center; 
      align-items: center;
    }
  }
  &__quantity {
    display: flex;
    height: 3.5rem;
    & > * {
      &:not(:last-child) {
        margin-right: .5rem;
      }
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

  &__actions {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
  }
  &__buy {
    flex: 1;
  }
  &__wishlist {
    flex: 1;
    text-align: center;
  }
  &__loading {
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.75);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    color: $color-gray-light;
  }

  &__header {
    flex: 1;
  }
  &__details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__reviews,
  &__details {
    flex: 3;
  }
}
</style>
