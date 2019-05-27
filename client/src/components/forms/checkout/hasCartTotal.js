import { GET_SHIPPING_TYPE, GET_CURRENT_CUSTOMER} from '@/apollo/operations'

export default {
  methods: {
    getItemPrice (item) {
      return ((parseFloat(item.product.price) * 100 * item.quantity)/ 100).toFixed(2)
    },
    formatPrice (...prices) {
      return '£' + prices.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2)
    }
  },
  computed: {
    cartTotal () {
      return this.currentCustomer.cart.items.reduce((cur, inc) => {
        return cur + parseFloat(this.getItemPrice(inc))
      }, 0).toFixed(2)
    }
  },
  apollo: {
    shippingType () {
      return {
        query: GET_SHIPPING_TYPE
      }
    },
    currentCustomer () {
      return {
        query: GET_CURRENT_CUSTOMER
      }
    }
  }
}