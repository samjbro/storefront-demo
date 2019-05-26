<template>
  <div class="payment-form">
    Payment
    <CheckoutButtons @submit="submit" @cancel="cancel" />
  </div>
</template>

<script>
import CheckoutButtons from './CheckoutButtons'
export default {
  components: { CheckoutButtons },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
