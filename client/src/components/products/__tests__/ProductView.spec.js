import {
  mount
} from '@vue/test-utils'

import ProductView from '../ProductView'

describe('ProductView.vue', () => {
  const spies = {}
  beforeEach(() => {
    jest.resetModules()
  })
  it('constructs an image url', () => {
    const oldEnv = process.env
    const imgUrl = 'some-url'
    const imgId = 'some-id'
    process.env = {
      ...oldEnv,
      PRODUCT_IMAGE_URL: imgUrl
    }
    const wrapper = mount(ProductView)
    expect(wrapper.vm.getImgUrl(imgId)).toEqual(`${imgUrl}/${imgId}`)
  })
})