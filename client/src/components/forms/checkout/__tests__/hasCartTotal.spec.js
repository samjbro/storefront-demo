import {
  mount
} from '@vue/test-utils'
import hasCartTotal from '../hasCartTotal'

describe('hasCartTotal', () => {
  it('can calculate the cart total', () => {
    const itemA = {
      product: {
        price: 50
      },
      quantity: 2
    }
    const itemB = {
      product: {
        price: 99.5
      },
      quantity: 1
    }
    const currentCustomer = {
      cart: {
        items: [
          itemA, itemB
        ]
      }
    }
    const wrapper = renderComponent({
      data: {
        currentCustomer
      }
    })
    expect(wrapper.vm.cartTotal).toBe('199.50')

  })
})

const renderComponent = ({
  data
}) => {
  const fakeComponent = {
    template: '<div />'
  }
  return mount(fakeComponent, {
    mixins: [hasCartTotal],
    data: () => ({
      ...data
    })
  })
}