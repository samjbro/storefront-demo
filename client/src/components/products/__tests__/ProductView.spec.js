import {
  mount,
  shallowMount
} from '@vue/test-utils'

import ProductView from '../ProductView'
import {
  GET_PRODUCT
} from '@/apollo/operations';
import {
  SET_CURRENT_PRODUCT
} from '../../../apollo/operations/mutations';

describe('ProductView', () => {
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
  it('can request a new product by id', async () => {
    const productId = 999
    const query = jest.fn(() => ({
      data: {}
    }))
    const wrapper = renderComponent({
      query
    })
    await wrapper.vm.getProduct(productId)
    expect(query).toHaveBeenCalledWith(expect.objectContaining({
      query: GET_PRODUCT,
      variables: {
        id: productId
      }
    }))
  })
  it('sets the new product as the current product', async () => {
    const product = {
      id: 999
    }
    const query = jest.fn(() => ({
      data: {
        product
      }
    }))
    const mutate = jest.fn()
    const wrapper = renderComponent({
      query,
      mutate
    })
    await wrapper.vm.getProduct(999)
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: SET_CURRENT_PRODUCT,
      variables: {
        product
      }
    }))
  })
  it('filters out reviews with a rating of below 0 and above 5', () => {})
  it('calculates an average rating from review scores', () => {})
})

const renderComponent = ({
  query = () => {},
  mutate = () => {}
}) => {
  return mount(ProductView, {
    mocks: {
      $apollo: {
        query,
        mutate
      }
    }
  })
}