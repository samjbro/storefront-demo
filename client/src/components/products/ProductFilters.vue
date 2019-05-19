<template>
  <div class="product-filters">
    Filters
    <input type="number" v-model="limit" :min="1">
    <button class="button" @click="filter">Filter</button>
  </div>
</template>

<script>
import { GET_SEARCH_TERMS, SET_SEARCH_TERMS } from '@/apollo/operations'
export default {
  data () {
    return {
      limit: 0
    }
  },
  methods: {
    filter () {
      this.$apollo.mutate({
        mutation: SET_SEARCH_TERMS,
        variables: {
          data: {
            page: 1,
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
    }
  }
}
</script>

<style lang="scss">
.product-filters {
  flex: 1;
  margin-right: 2rem;
}
</style>
