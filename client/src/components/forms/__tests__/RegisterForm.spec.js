import {
  mount
} from '@vue/test-utils'

import RegisterForm from '../RegisterForm'
import {
  REGISTER
} from '@/apollo/operations'

describe('RegisterForm.vue', () => {
  it('will not attempt to register without all the necessary data', async () => {
    const mutate = mockMutate()
    const wrapper = renderComponent(mutate)
    await wrapper.vm.register()
    expect(mutate).not.toBeCalledWith(expect.objectContaining({
      mutation: REGISTER
    }))
  })
  it('will not attempt register if password and confirmation do not match', async () => {
    const password = 'password123'
    const otherPassword = 'does-not-match'
    const mutate = mockMutate()
    const wrapper = renderComponent(mutate)
    wrapper.setData({
      password,
      passwordConfirmation: otherPassword
    })
    await wrapper.vm.register()
    expect(mutate).not.toBeCalledWith(expect.objectContaining({
      mutation: REGISTER
    }))
  })
  it('will attempt register if passwords match', async () => {
    const name = 'some-name'
    const email = 'some-email'
    const password = 'password123'
    const mutate = mockMutate({
      data: {
        register: {
          token: '123',
          customer: {}
        }
      }
    })
    const wrapper = renderComponent(mutate)
    wrapper.setData({
      name,
      email,
      password,
      passwordConfirmation: password
    })
    await wrapper.vm.register()
    expect(mutate).toBeCalledWith(expect.objectContaining({
      mutation: REGISTER,
      variables: {
        data: {
          name,
          email,
          password
        }
      }
    }))
  })

  it('sets the login token in local storage', async () => {
    const name = 'some-name'
    const email = 'some@email.com'
    const password = 'password123'
    const spy = jest.spyOn(Storage.prototype, 'setItem')
    const token = 'sometoken123'
    const mutate = mockMutate({
      data: {
        register: {
          token
        }
      }
    })
    const wrapper = renderComponent(mutate)
    wrapper.setData({
      name,
      email,
      password,
      passwordConfirmation: password
    })
    await wrapper.vm.register()
    expect(spy).toHaveBeenCalledWith('token', token)
    spy.mockRestore()
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