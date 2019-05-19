<template>
  <div class="product-cards">
    <div class="product-cards__pagination">
      <div 
        class="product-cards__arrow product-cards__arrow--back" 
        :class="{'product-cards__arrow--hidden': page < 2}"
        @click="goToPage(page - 1)">
        <img src="~img/arrow-left.svg" alt="back">
        <span>Back</span>
      </div>
      <div class="product-cards__pagenums">
        <div
          :key='1'
          class="product-cards__pagenum"
          :class="{'product-cards__pagenum--current': page === 1 }"
          @click="goToPage(1)"
        >1</div>
        <div class="product-cards__pagenum" v-if="page > 3">
          ...
        </div>        
        <div 
          v-for="(num, index) in pageCountSelection" 
          :key="num"
          class="product-cards__pagenum"
          :class="{'product-cards__pagenum--current': page === num }"
          @click="goToPage(num)"
        >
          {{ num }}
        </div>
        <div class="product-cards__pagenum" v-if="page < pageCount - 3">
          ...
        </div>        
        <div
          :key='pageCount'
          class="product-cards__pagenum"
          :class="{'product-cards__pagenum--current': page === pageCount }"
          @click="goToPage(pageCount)"
        >{{ pageCount }}</div>
      </div>
      <div
       class="product-cards__arrow product-cards__arrow--forward"
        @click="goToPage(page + 1)"
        :class="{'product-cards__arrow--hidden': page > pageCount - 1}"
      >
        <span>Forward</span>
        <img src="~img/arrow-right.svg" alt="forward">
      </div>
    </div>
    <div class="product-cards__page-wrapper">
      <transition
        :name="prevPage < page
              ? 'product-cards__page--transitioning-left'
              : 'product-cards__page--transitioning-right'"
      >
      <div class="product-cards__page" :key='page'>
        <ProductCard
          v-for="product in productList" 
          :key="product.product_id" 
          :product="product" 
        />
      </div>
      </transition>
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
      page: 1,
      prevPage: 1,
      limit: 6,
      productsLoading: 0
    }
  },
  methods: {
    goToPage (page) {
      this.prevPage = this.page
      if (page > 0 && page < (this.pageCount + 1)) {
        this.page = page
      }
    } 
  },
  computed: {
    pageCount () {
      if (!this.products) return 1
      return Math.ceil(this.products.count / this.limit)
    },
    pageCountSelection () {
      let middleNum = this.page
      let start, end = false
      if (middleNum < 4) {
        start = true
        middleNum += (4 - middleNum)
      } else if (middleNum > this.pageCount - 4) {
        end = true
        middleNum -= (3 - (this.pageCount - middleNum))
      }

      const selection = [
        middleNum -1,
        middleNum,
        middleNum + 1
      ]
      if (start) selection.unshift(middleNum - 2)
      if (end) selection.push(middleNum + 2)
      return selection
    },
    defaultList () {
      const list = []
      for (let i = 0; i < this.limit; i++) {
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
    productList () {
      return this.productsLoading
        ? this.defaultList
        : this.products.product_list
    }
  },
  apollo: {
    products () {
      return {
        query: GET_PRODUCTS,
        loadingKey: 'productsLoading',
        variables () {
          return {
            page: this.page,
            limit: this.limit
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
  min-height: 100%;
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
    flex: 1;
    & > * {
      &:not(:last-child) {
        margin-right: .5rem;
      }
    }
    &:hover {
      transform: scale(1.2);
    }

    &--hidden {
      visibility: hidden;
    }
  }
  &__pagenums {
    display: flex;
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
    transition: transform 1s;
    cursor: pointer;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    &:hover {
      transform: scale(1.2);
    }

    &--current {
      color: $color-white;
      background: $color-red;
      transform: scale(1.2);
    }
  }
  &__page-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    padding-bottom: 2rem;
  }

  &__page {
    width: 100%;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    justify-content: center;

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
        &-leave-active,
        &-enter-to,
        &-leave-to {
          position: absolute;
          top: 0;
          height: 100%;
        }
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
  &__item {

  }

}
</style>