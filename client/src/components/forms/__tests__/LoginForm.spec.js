import {
  mount
} from '@vue/test-utils'
import {
  LOG_IN,
  SET_CURRENT_CUSTOMER
} from '@/apollo/operations'
import LoginForm from '../LoginForm'

describe('LoginForm.vue', () => {
  let spy, wrapper
  afterEach(() => {
    spy && spy.mockRestore()
  })
  it('attempts login using supplied data', async () => {
    const email = 'some-email@email.com'
    const password = 'some-password123'
    const mutate = mockMutate()
    wrapper = renderComponent(mutate)
    wrapper.setData({
      email,
      password
    })
    await wrapper.vm.login()
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: LOG_IN,
      variables: {
        data: {
          email,
          password
        }
      }
    }))
  })
  it('sets the login token in local storage', async () => {
    spy = jest.spyOn(Storage.prototype, 'setItem')
    const token = 'sometoken123'
    const mutate = mockMutate(token)
    wrapper = renderComponent(mutate)
    await wrapper.vm.login()
    expect(spy).toHaveBeenCalledWith('token', token)
  })
  it('sets the current customer', async () => {
    const customer = {
      name: 'some-customer'
    }
    const mutate = mockMutate(null, customer)
    wrapper = renderComponent(mutate)
    await wrapper.vm.login()
    expect(mutate).toHaveBeenNthCalledWith(2, expect.objectContaining({
      mutation: SET_CURRENT_CUSTOMER,
      variables: {
        customer
      }
    }))
  })
})

const renderComponent = (mutate) => {
  return mount(LoginForm, {
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}

const mockMutate = (token = 'token123', customer = {
  name: 'customer123'
}) => {
  return jest.fn(() => ({
    data: {
      login: {
        token,
        customer
      }
    }
  }))
}