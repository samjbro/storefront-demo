import {
  mount
} from '@vue/test-utils'

import LoginForm from '../LoginForm'

describe('LoginForm.vue', () => {
  let spy, wrapper
  const token = 'some-token'
  beforeEach(() => {
    const mutate = jest.fn(() => ({
      data: {
        login: {
          token,
          customer: {}
        }
      }
    }))

    wrapper = mount(LoginForm, {
      mocks: {
        $apollo: {
          mutate
        }
      }
    })

  })
  afterEach(() => {
    spy.mockRestore()
  })
  it('sets the login token in local storage', async () => {
    spy = jest.spyOn(Storage.prototype, 'setItem')
    await wrapper.vm.login()
    expect(spy).toHaveBeenCalledWith('token', token)
  })
  it('sets the current customer', () => {

  })
})