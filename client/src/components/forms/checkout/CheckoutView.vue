‰<template>
  <div class="checkout-view">
    <h1 class="checkout-view__header">
      Checkout
    </h1>
    <div class="checkout-view__progress">
      <ProgressBar :nodes="checkoutNodes" />
    </div>
    <DeliveryForm
      class="checkout-view__content"
      v-show="highestNode === -1" 
      @submit="submit(0)" @cancel="cancel(0)"/>
    <ConfirmationPage
      class="checkout-view__content"
     v-show="highestNode === 0" 
       @submit="submit(1)" @cancel="cancel(1)" />
    <PaymentForm
      class="checkout-view__content"
      v-show="highestNode === 1" 
       @submit="submit(2)" @cancel="cancel(2)" />
    <SuccessPage
      class="checkout-view__content"
      v-show="highestNode >= 2" 
       @submit="submit(3)" />
  </div>
</template>

<script>
import { SHOW_OVERLAY, CLOSE_OVERLAY } from '@/apollo/operations'
import ProgressBar from '@/components/shared/ProgressBar'
import DeliveryForm from './DeliveryForm'
import ConfirmationPage from './ConfirmationPage'
import PaymentForm from './PaymentForm'
import SuccessPage from './SuccessPage'
export default {
  components: { ProgressBar, DeliveryForm, ConfirmationPage, PaymentForm, SuccessPage },
  data () {
    return {
      checkoutNodes: [
        { name: 'Delivery', complete: false },
        { name: 'Confirmation', complete: false },
        { name: 'Payment', complete: false },
        { name: 'Finish', complete: false }
      ]
    }
  },
  computed: {
    highestNode () {
      let highest = -1
      this.checkoutNodes.forEach((node, i) => {
        if (node.complete) highest = i
      })
      return highest
    }
  },
  methods: {
    submit (nodeIndex) {
      if (nodeIndex === this.checkoutNodes.length - 1) {
        this.$apollo.mutate({
          mutation: CLOSE_OVERLAY
        })
      }
      this.checkoutNodes[nodeIndex].complete = true
      if (nodeIndex === this.checkoutNodes.length - 2) {
        this.checkoutNodes[nodeIndex + 1].complete = true
      }
    },
    cancel (nodeIndex) {
      if (nodeIndex === 0) {
        this.$apollo.mutate({
          mutation: SHOW_OVERLAY,
          variables: { view: 'cart' }
        })
      } else {
        this.checkoutNodes[nodeIndex - 1].complete = false
      }
    }
  }
}
</script>

<style lang="scss">
.checkout-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 2rem;

  &__header {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
