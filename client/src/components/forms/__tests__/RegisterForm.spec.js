import {
  mount
} from '@vue/test-utils'

import RegisterForm from '../RegisterForm'
import {
  REGISTER,
  SET_CURRENT_CUSTOMER
} from '@/apollo/operations'

describe('RegisterForm.vue', () => {
  let registerData
  const spies = {}
  beforeEach(() => {
    spies.localStorageSetItem = jest.spyOn(Storage.prototype, 'setItem')
    registerData = {
      name: 'some-name',
      email: 'some@email.com',
      password: 'somepassword123',
      passwordConfirmation: 'somepassword123'
    }
  })
  afterEach(() => {
    Object.keys(spies).forEach(spy => {
      spies[spy].mockRestore()
    })
  })
  it('will not attempt to register without all the necessary data', async () => {
    const mutate = mockMutate()
    const wrapper = renderComponent(mutate)
    await wrapper.vm.register()
    expect(mutate).not.toBeCalledWith(expect.objectContaining({
      mutation: REGISTER
    }))
  })
  it('will not attempt register if password and confirmation do not match', async () => {
    registerData.passwordConfirmation = 'does-not-match'
    const mutate = mockMutate()
    const wrapper = renderComponent(mutate)
    wrapper.setData(registerData)
    await wrapper.vm.register()
    expect(mutate).not.toBeCalledWith(expect.objectContaining({
      mutation: REGISTER
    }))
  })
  it('will attempt register if passwords match', async () => {
    const mutate = mockMutate({
      data: {
        register: {}
      }
    })
    const wrapper = renderComponent(mutate)
    wrapper.setData(registerData)
    await wrapper.vm.register()
    expect(mutate).toBeCalledWith(expect.objectContaining({
      mutation: REGISTER,
      variables: {
        data: {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        }
      }
    }))
  })

  it('sets the login token in local storage', async () => {
    const token = 'sometoken123'
    const mutate = mockMutate({
      data: {
        register: {
          token
        }
      }
    })
    const wrapper = renderComponent(mutate)
    wrapper.setData(registerData)
    await wrapper.vm.register()
    expect(spies.localStorageSetItem).toHaveBeenCalledWith('token', token)
  })
  it('sets current customer after successful register', async () => {
    const customer = {
      name: 'some-customer'
    }
    const mutate = mockMutate({
      data: {
        register: {
          customer
        }
      }
    })
    const wrapper = renderComponent(mutate)
    wrapper.setData(registerData)
    await wrapper.vm.register()
    expect(mutate).toHaveBeenNthCalledWith(2, expect.objectContaining({
      mutation: SET_CURRENT_CUSTOMER,
      variables: {
        customer
      }
    }))
  })
})

const renderComponent = (mutate) =>
  mount(RegisterForm, {
    mocks: {
      $apollo: {
        mutate
      }
    }
  })

const mockMutate = (data = {}) => jest.fn(() => (data))