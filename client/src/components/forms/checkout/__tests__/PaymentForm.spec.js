import {
  mount
} from '@vue/test-utils'

import PaymentForm from '../PaymentForm'
import {
  CREATE_ORDER
} from '@/apollo/operations';

describe('PaymentForm', () => {
  it('can create an order', () => {
    const mutate = jest.fn()
    const wrapper = mount(PaymentForm, {
      data: () => ({
        currentCustomer: {
          cart: {
            items: []
          }
        },
        shippingType: {},
        cardData: {}
      }),
      mocks: {
        $apollo: {
          mutate
        }
      }
    })
    wrapper.vm.submit()
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: CREATE_ORDER
    }))
  })
})