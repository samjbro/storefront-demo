import {
  mount
} from '@vue/test-utils'

import ShoppingCart from '../ShoppingCart'
import {
  UPDATE_CART,
  REMOVE_CART_ITEM
} from '../../../apollo/operations/mutations';

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
  it('can request that an item quantity be incremented', () => {
    const mutate = jest.fn(() => ({
      data: {
        updateCart: {}
      }
    }))
    const wrapper = renderComponent({
      mutate
    })
    const item = {
      item_id: 1,
      quantity: 1,
      product: {}
    }
    const direction = 1
    wrapper.vm.increment(direction, item)
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: UPDATE_CART,
      variables: {
        data: {
          item_id: item.item_id,
          quantity: item.quantity + direction
        }
      }
    }))
  })
  it('will not increment item quantity below 1', () => {
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate
    })
    const item = {
      item_id: 1,
      quantity: 1,
      product: {}
    }
    const direction = -1
    wrapper.vm.increment(direction, item)
    expect(mutate).not.toHaveBeenCalled()
  })
  it('can request that an item be removed from the cart', () => {
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate
    })
    const item = {
      item_id: 999
    }
    wrapper.vm.remove(item)
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: REMOVE_CART_ITEM,
      variables: {
        item_id: item.item_id
      }
    }))
  })
})

const renderComponent = ({
  data,
  mutate
}) => {
  return mount(ShoppingCart, {
    data: () => ({
      currentCustomer: {
        cart: {
          items: []
        }
      },
      ...data
    }),
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}