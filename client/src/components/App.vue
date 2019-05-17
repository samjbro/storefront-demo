<template>
  <div class="app">
    <MainHeader />
    <MainContent />
    <MainOverlay />
  </div>
</template>

<script>
import { GET_ME, SET_CURRENT_CUSTOMER } from '@/apollo/operations'
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
  }
}

</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
</style>
