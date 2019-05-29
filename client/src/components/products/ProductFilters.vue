<template>
  <div class="product-filters">
    <div class="product-filters__panel">
      <div class="product-filters__item-info">
        <h1 class="product-filters__title">
          Showing {{ products && products.count }} items
        </h1>
        <div class="product-filters__limit">
          <label for="limit">Products per page:</label>
          <QuantityInput :quantity="limit" @increment="direction => updateLimit(direction)" />
        </div>
      </div>
      <div class="product-filters__filters">
        <div class="product-filters__dropdown-header">
          <a class="button" @click="expanded = !expanded">
            {{ expanded ? 'Hide Filters' : 'Show Filters' }}
          </a>
        </div>
        <div class="product-filters__categories" :class="{'product-filters__categories--expanded': expanded}">
          <div class="product-filters__header">
            Category
          </div>
          <div class="product-filters__options">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_SEARCH_TERMS, SET_SEARCH_TERMS, GET_CATEGORIES, GET_PRODUCTS } from '@/apollo/operations'
import QuantityInput from '@/components/shared/QuantityInput'
export default {
  components: { QuantityInput },
  data () {
    return {
      limit: 0,
      expanded: false
    }
  },
  methods: {
    updateLimit (direction) {
      if (this.limit + direction < 1) return
      this.limit += direction
      this.filter(this.searchTerms)
    },
    filter (terms) {
      this.$apollo.mutate({
        mutation: SET_SEARCH_TERMS,
        variables: {
          data: {
            page: 1,
            ...terms,
            limit: parseInt(this.limit)
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
@import "~#/abstracts/mixins";
.product-filters {
  margin-right: 2rem;
  margin-top: 3rem;

  @include respond(phone) {
    margin: 0;
  }

  &__panel {
    box-shadow: 0 .2rem .4rem 0 $color-gray-med; 
    background-color: $color-off-white;
    & > * {
      padding: 1rem 1.5rem;
    }
    padding-bottom: 1rem;

    @include respond(phone) {
      margin-bottom: 1rem;
      box-shadow: none;
      padding-bottom: 0;
    }
  }
  &__item-info {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @include respond(phone) {
      flex-direction: row;
    }
  }

  &__title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    @include respond(phone) {
      margin: 0;
    }

  }

  &__limit {
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      margin-right: 1rem;
    }
  }

  &__header {
    font-weight: 600;
    color: $color-gray-med;
    margin-bottom: .5rem;
    @include respond(phone) {
      font-size: 2rem;
    }
  }
  &__filters {
    background-color: $color-white;
    display: flex;
    flex-direction: column;
  }
  &__dropdown-header {
    display: none;
    flex: 1;

    @include respond(phone) {
      display: initial;
    }
    .button {
      font-size: 2rem;
      padding: .5rem .8rem;  
    }
  }

  &__categories {
    display: flex;
    flex-direction: column;
    @include respond(phone) {
      align-items: center;
      max-height: 0;
      overflow: hidden;
      display: none;
      &--expanded {
        padding-top: 1rem;
        max-height: 100%;
        display: initial;
      }
    }
  }
  &__options {
    width: 100%;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    @include respond(phone) {
      font-weight: 600;
      font-size: 2rem;
      display: grid;
      grid-gap: .5rem;
      grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
    }
  }
  &__link {
    @include respond(phone) {
      text-align: center;
    }
    &--active {
      color: $color-red;
      font-weight: 600;
    }
  }
}
</style>
