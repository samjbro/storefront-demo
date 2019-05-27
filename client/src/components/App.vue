<template>
  <div class="app">
    <MainHeader />
    <MainContent />
    <MainOverlay />
  </div>
</template>

<script>
import { GET_ME, SET_CURRENT_CUSTOMER, GET_SHIPPING_REGIONS } from '@/apollo/operations'
import MainHeader from './layout/MainHeader'
import MainContent from './layout/MainContent'
import MainOverlay from './layout/MainOverlay'

export default {
  components: {
    MainHeader,
    MainContent,
    MainOverlay
  },
  async mounted () {
    if (!localStorage.getItem('rememberMe')) {
      localStorage.removeItem('token')
      return
    }
    try {
      const { data } = await this.$apollo.query({
        query: GET_ME
      })
      await this.$apollo.mutate({
        mutation: SET_CURRENT_CUSTOMER,
        variables: {
          customer: data.me
        }
      })
    } catch (e) {
      console.error(e)
    }
  },
  apollo: {
    // Retrieving shipping regions on app load to make checkout smoother
    shippingRegions () {
      return {
        query: GET_SHIPPING_REGIONS
      }
    }
  }
}

</script>

<style lang="scss">
@import "~#/abstracts/variables";
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background-color: $color-off-white;
  overflow: hidden;
}
</style>
