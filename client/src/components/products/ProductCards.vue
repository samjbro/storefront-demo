<template>
  <div class="product-cards">
    <div class="product-cards__pagination">
      <div class="product-cards__arrow product-cards__arrow--back" @click="goToPage(page - 1)">
        <img src="~img/arrow-left.svg" alt="back">
        <span>Back</span>
      </div>
      <div 
        v-for="num in pageCount" 
        :key="num"
        class="product-cards__pagenum"
        :class="{'product-cards__pagenum--current': page === num }"
      >
        {{ num }}
      </div>
      <div class="product-cards__arrow product-cards__arrow--forward" @click="goToPage(page + 1)">
        <span>Forward</span>
        <img src="~img/arrow-right.svg" alt="forward">
      </div>
    </div>
    <div class="product-cards__content">
      <ProductCard v-for="product in products" :key="product.product_id" :product="product" />
    </div>
  </div>
</template>

<script>
import { GET_PRODUCTS } from '@/apollo/operations'
import ProductCard from './ProductCard'
export default {
  components: { ProductCard },
  data () {
    return {
      page: 1
    }
  },
  methods: {
    goToPage (page) {
      if (page > 0) {
        this.page = page
      }
    } 
  },
  computed: {
    pageCount () {
      return 10;
    }
  },
  apollo: {
    products () {
      return {
        query: GET_PRODUCTS,
        variables () {
          return {
            page: this.page,
            limit: 6
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.product-cards {
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__pagination {
    margin-bottom: 1.5rem;
    display: flex;

    & > * {
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }

  &__arrow {
    transition: transform .2s;
    cursor: pointer;
    display: flex;
    align-items: center;  
    & > * {
      &:not(:last-child) {
        margin-right: .5rem;
      }
    }
    &:hover {
      transform: scale(1.2);
    }
  }

  &__pagenum {
    font-weight: 600;
    color: #000;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform .2s;

    &--current {
      color: $color-white;
      background: $color-red;
      transform: scale(1.2);
    }
  }

  &__content {
    width: 100%;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    justify-content: center;
  }
}
</style>
