<template>
  <div class="product-view">
    <div class="product-view__arrow product-view__arrow--left" @click="getProduct(-1)">
      <fa-icon :icon="['fas', 'angle-left']" />
    </div>
    <div class="product-view__arrow product-view__arrow--right" @click="getProduct(1)">
      <fa-icon :icon="['fas', 'angle-right']" />
    </div>
    <template v-if="!currentProduct">
      <fa-icon :icon="['fas', 'spinner']" spin />
    </template>
    <template v-else>
      <div class="product-view__images">
        <div class="product-view__image product-view__image--main">
          <img :src="getImgUrl(currentProduct[currentImage])" :alt="currentProduct.image">
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
        <h1 class="product-view__name">
          {{ currentProduct.name }}
        </h1>
        <div class="product-view__price">
          {{ formattedPrice }}
        </div>
        <div class="product-view__description">
          {{ currentProduct.description }}
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
    </template>
  </div>
</template>

<script>
import { GET_CURRENT_PRODUCT, GET_PRODUCT, SET_CURRENT_PRODUCT } from '@/apollo/operations'
export default {
  data () {
    return {
      isLoading: 0,
      currentImage: 'image'
    }
  },
  computed: {
    formattedPrice () {
      return '£' + this.currentProduct.price
    }
  },
  methods: {
    getImgUrl (img) {
      return `https://backendapi.turing.com/images/products/${img}`
    },
    async getProduct (direction) {
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
  min-width: 75vw;
  max-height: 80vh;
  justify-content: center;
  position: relative;
  // padding-top: 3rem;
  align-items: center;

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

    }
    &--right {
      right: -10rem;
    }
  }

  &__images {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 50vh;
    margin-right: 4rem;
  }
  &__image {
    display: flex;
    align-items: center;
    img {
        height: auto;
        max-height: 100%;
        width: 100%;
    }
    &--main {
      flex: 2;
    }
    &--thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      img {
        height: 9rem;
        width: 9rem;
      }
    }
  }
  &__thumbnails {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  &__info {
    flex: 2;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__name {
    // padding-top: 2rem;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    margin-left: -2rem;
    // color: $color-gray-med;
  }
  &__price {
    color: $color-red;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  &__description {
    max-width: 50vw;
    margin-bottom: 2rem;
    // padding-left: 1rem;
  }
  &__actions {
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
}
</style>


