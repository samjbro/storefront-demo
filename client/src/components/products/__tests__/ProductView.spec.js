import {
  mount,
  shallowMount
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
  it('can get the next product id when given a direction', () => {
    const productId = '2'
    const wrapper = shallowMount(ProductView, {
      data: () => ({
        currentProduct: {
          product_id: productId,
          reviews: []
        }
      })
    })
    expect(wrapper.vm.getNextProductId(1)).toBe('3')
    expect(wrapper.vm.getNextProductId(-1)).toBe('1')
  })
  it('can get a new product ', async () => {
    const mutate = jest.fn(() => ({
      data: {
        product: {}
      }
    }))
    const wrapper = mount(ProductView, {
      mocks: {
        $apollo: {
          mutate
        }
      }
    })

  })
  it('filters out reviews with a rating of below 0 and above 5', () => {})
  it('calculates an average rating from review scores', () => {})
})