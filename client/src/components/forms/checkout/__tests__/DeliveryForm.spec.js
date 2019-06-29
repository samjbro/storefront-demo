import {
  mount
} from '@vue/test-utils'

import DeliveryForm from '../DeliveryForm'
import {
  SET_SHIPPING_TYPE
} from '../../../../apollo/operations/mutations';

describe('DeliveryForm', () => {
  it('can set the shipping type', () => {
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate
    })
    const shippingType = 'some-shipping-type'
    wrapper.vm.setShippingType(shippingType)
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: SET_SHIPPING_TYPE,
      variables: {
        shippingType
      }
    }))
  })
})

const renderComponent = ({
  mutate
}) => {
  return mount(DeliveryForm, {
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}