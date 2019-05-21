<template>
  <div class="product-filters">
    <h1 class="product-filters__title">
      Showing {{ products && products.count }} items
    </h1>
    <div class="product-filters__categories">
      <a 
        class="product-filters__link"
        :class="{'product-filters__link--active': searchTerms.category_id === 0}"
        :key="0"
        @click.prevent="filter({category_id: 0})">
        All Categories
      </a>
      <a 
        v-for="category in categories" 
        class="product-filters__link"
        :class="{'product-filters__link--active': searchTerms.category_id == category.category_id}"
        :key="category.category_id"
        @click.prevent="filter({category_id: parseInt(category.category_id)})">
        {{ category.name }}
      </a>
    </div>
    <div class="product-filters__filter">
      <label for="limit">Products per page:</label>
      <input id="limit" type="number" v-model="limit" :min="1">
    </div>
    <button class="button" @click="filter">Filter</button>
  </div>
</template>

<script>
import { GET_SEARCH_TERMS, SET_SEARCH_TERMS, GET_CATEGORIES, GET_PRODUCTS } from '@/apollo/operations'
export default {
  data () {
    return {
      limit: 0
    }
  },
  methods: {
    filter (terms) {
      this.$apollo.mutate({
        mutation: SET_SEARCH_TERMS,
        variables: {
          data: {
            page: 1,
            limit: parseInt(this.limit),
            ...terms
          }
        }
      })
    }
  },
  apollo: {
    searchTerms () {
      return {
        query: GET_SEARCH_TERMS,
        result ({data: { searchTerms }}) {
          this.limit = searchTerms.limit
        }
      }
    },
    categories () {
      return {
        query: GET_CATEGORIES
      }
    },
    products () {
      return {
        query: GET_PRODUCTS,
        variables () {
          return {
            data: {
              ...this.searchTerms,
              __typename: undefined
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.product-filters {
  flex: 1;
  margin-right: 2rem;

  &__filter {
    display: flex;
    margin-bottom: 1rem;
  }

  &__categories {
    display: flex;
    flex-direction: column;
  }
  &__link {
    &--active {
      color: $color-red;
    }
  }
}
</style>
