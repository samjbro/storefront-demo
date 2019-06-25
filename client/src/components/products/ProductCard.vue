<template>
  <transition name="product-card--transitioning">
    <div class="product-card" @click="showProduct">
      <div class="product-card__thumb" :class="{'product-card__thumb--loading': product.loading}">
        <fa-icon
          v-if="product.loading"
          class="product-card__spinner"
          :icon="['fas', 'spinner']"
          spin
        />
        <img
          v-else
          :src="`https://backendapi.turing.com/images/products/${product.thumbnail}`"
          :alt="product.thumbnail"
        >
      </div>
      <div class="product-card__name">{{ product.name }}</div>
      <div
        class="product-card__price"
        :class="{
        'product-card__price--old': discountActive
      }"
      >
        <span v-if="discountActive">Was:</span>
        {{ formatPrice(product.price) }}
      </div>
      <div v-if="discountActive" class="product-card__price">
        <span>Now:</span>
        {{ formatPrice(product.discounted_price) }}
      </div>
    </div>
  </transition>
</template>

<script>
import {
  SHOW_OVERLAY,
  GET_PRODUCT,
  SET_CURRENT_PRODUCT
} from "@/apollo/operations";
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    discountActive() {
      return this.product.discounted_price !== "0.00";
    }
  },
  methods: {
    async showProduct() {
      this.$apollo.mutate({
        mutation: SET_CURRENT_PRODUCT,
        variables: {
          product: null
        }
      });
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: { view: "product" }
      });
      const { data } = await this.$apollo.query({
        query: GET_PRODUCT,
        variables: {
          id: this.product.product_id
        }
      });
      this.$apollo.mutate({
        mutation: SET_CURRENT_PRODUCT,
        variables: {
          product: data.product
        }
      });
    },
    formatPrice(price) {
      if (this.product.loading) return this.product.price;
      return "£" + price;
    }
  }
};
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background-color: $color-white;
  overflow: hidden;
  box-shadow: 0 0.2rem 0.4rem 0 $color-gray-med;
  font-weight: 600;
  min-height: 30rem;
  cursor: pointer;
  transition: all 0.3s;

  @include respond(phone) {
    font-size: 3rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  &:hover {
    transform: translateY(-0.7rem);
    box-shadow: 0 0.4rem 0.8rem 0 $color-gray-med;
  }

  &__thumb {
    width: 18rem;
    height: 17rem;
    margin-bottom: 2rem;
    @include respond(phone) {
      width: 20rem;
    }

    &--loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  &__name {
    margin-bottom: 1rem;
  }

  &__price {
    color: $color-red;
    font-size: 1.8rem;
    @include respond(phone) {
      font-size: 3rem;
    }

    &--old {
      // transform: translateX(-5rem);
      font-size: 1.4rem;
      color: $color-gray-med;
      @include respond(phone) {
        font-size: 2rem;
      }
    }
  }

  &__spinner {
    font-size: 4rem;
  }
}
</style>
