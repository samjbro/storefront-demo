<template>
  <div class="product-cards">
    <ProductPaginator @goTo="getPage" :count="products ? parseInt(products.count) : 6" :currentPage="currentPage" :limit="searchTerms.limit" />
    <div class="product-cards__display" :class="{'product-cards__display--empty': !productsLoading && products.count === '0'}">
      <div 
        v-if="!productsLoading && products.count === '0'"
        class="product-cards__empty"
      >No Products Found</div>
      <template v-else>
      <transition
        :name="prevPage < currentPage
          ? 'product-cards__page--transitioning-left'
          : 'product-cards__page--transitioning-right'"
      >
        <div class="product-cards__page" :key="currentPage">
          <template v-if="productsLoading">
            <ProductCard
              v-show="productsLoading"
              v-for="(product, i) in defaultList"
              :key="i"
              :product="product"
            />
          </template>
          <template v-else>
            <ProductCard
              v-for="product in products.product_list"
              :key="product.product_id"
              :product="product"
            />
          </template>
        </div>
      </transition>
      </template>
    </div>
  </div>
</template>

<script>
import { GET_PRODUCTS, GET_SEARCH_TERMS } from '@/apollo/operations'
import ProductPaginator from './ProductPaginator'
import ProductCard from './ProductCard'
export default {
  components: { ProductPaginator, ProductCard },
  data () {
    return {
      currentPage: 1,
      prevPage: 1,
      productsLoading: 0
    }
  },
  methods: {
    getPage (page) {
      this.prevPage = this.currentPage
      this.currentPage = page
    }
  },
  computed: {
    productList () {
      return this.productsLoading
        ? this.defaultList
        : this.products.product_list
    },
    defaultList () {
      const list = []
      for (let i = 0; i < this.searchTerms.limit; i++) {
        list.push({
          product_id: i,
          name: 'Loading',
          price: 'Loading',
          thumbnail: '',
          loading: true
        })
      }
      return list
    },
  },
  apollo: {
    searchTerms () {
      return {
        query: GET_SEARCH_TERMS,
        result () {
          this.currentPage = 1
        }
      }
    },
    products () {
      return {
        query: GET_PRODUCTS,
        loadingKey: 'productsLoading',
        variables () {
          return {
            data: {
              page: this.currentPage,
              limit: this.searchTerms.limit,
              query_string: this.searchTerms.query_string
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.product-cards {
  // background: red;
  display: flex;
  flex-direction: column;
  &__display {
  // background: blue;
    position: relative;
    height: 100%;
    &--empty {
      overflow: hidden;
    }
  }
  &__empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
  }
  &__page {
    padding: 1rem 0 2rem 0;
    // background: green;
    position: absolute;
    width: 100%;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    justify-content: center;
    // overflow: auto;

    &--transitioning {
      &-left {
        &-enter-active {
          transform: translateX(105%);
          opacity: 0;
        }
        &-leave-to {
          transform: translateX(-105%);
        }
      }
      &-right {
        &-enter-active {
          transform: translateX(-105%);
          opacity: 0;
        }
        &-leave-to {
          transform: translateX(105%);
        }
      }
      &-left,
      &-right {
        &-enter-active,
        &-leave-active {
          transition: all 1s;
        }

        &-enter-to {
          transform: translateX(0);
          opacity: 1;
        }
        &-leave-to {
          opacity: 0;
        }
      }
    }
  }
}
</style>
