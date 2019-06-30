import {
  mount
} from '@vue/test-utils'

import DeliveryForm from '../DeliveryForm'
import {
  SET_SHIPPING_TYPE,
  ADD_CUSTOMER_ADDRESS
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
  it('can set a new customer address', () => {
    const mutate = jest.fn()
    const deliveryData = {
      firstName: 'some-name',
      lastName: 'some-last-name',
      address: 'some-address',
      city: 'some-city',
      state: 'some-state',
      zipCode: 'some-zip-code'
    }
    const wrapper = renderComponent({
      mutate,
      data: {
        deliveryData
      }
    })
    wrapper.vm.submit()
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: ADD_CUSTOMER_ADDRESS,
      variables: {
        data: deliveryData
      }
    }))
  })
  it('will not attempt to add customer address if input data is incomplete', () => {})
})

const renderComponent = ({
  mutate,
  data
}) => {
  return mount(DeliveryForm, {
    data: () => ({
      ...data
    }),
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}