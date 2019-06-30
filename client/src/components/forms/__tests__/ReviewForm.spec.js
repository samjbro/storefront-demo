import {
  mount
} from '@vue/test-utils'
import ReviewForm from '../ReviewForm'
import {
  ADD_REVIEW
} from '../../../apollo/operations/mutations';

describe('ReviewForm', () => {
  it('can add a review', () => {
    const mutate = jest.fn()
    const review = 'some-review'
    const rating = 3
    const currentProduct = {
      product_id: 999
    }
    const wrapper = mount(ReviewForm, {
      data: () => ({
        review,
        rating,
        currentProduct
      }),
      mocks: {
        $apollo: {
          mutate
        }
      }
    })
    wrapper.vm.submit()
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      mutation: ADD_REVIEW,
      variables: {
        data: {
          review,
          rating,
          product_id: currentProduct.product_id
        }
      }
    }))
  })
})