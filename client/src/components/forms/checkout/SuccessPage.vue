<template>
  <div class="success-page">
    Success
    <CheckoutButtons @submit="submit" :last="true" />
  </div>
</template>

<script>
import CheckoutButtons from './CheckoutButtons'
export default {
  components: { CheckoutButtons },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>
