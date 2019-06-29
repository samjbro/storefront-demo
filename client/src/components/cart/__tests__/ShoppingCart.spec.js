import {
  mount
} from '@vue/test-utils'

import ShoppingCart from '../ShoppingCart'

describe('ShoppingCart', () => {
  it('can calculate the total price of the cart', () => {
    const itemA = {
      product: {
        price: 50,
      },
      quantity: 2
    }
    const itemB = {
      product: {
        price: 99.5,
      },
      quantity: 1
    }
    const currentCustomer = {
      cart: {
        items: [itemA, itemB]
      }
    }
    const wrapper = renderComponent({
      data: {
        currentCustomer
      }
    })
    expect(wrapper.vm.totalPrice).toBe('199.50')
  })
  it('can request that the cart be updated', () => {})
  it('can request that an item be removed from the cart', () => {})
})

const renderComponent = ({
  data,
  mutate
}) => {
  return mount(ShoppingCart, {
    data: () => (data),
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}