import {
  mount
} from '@vue/test-utils'

import ProductFilters from '../ProductFilters'
import {
  SET_SEARCH_TERMS
} from '@/apollo/operations';

describe('ProductFilters.vue', () => {
  it('can update search terms', () => {
    const mutate = jest.fn()
    const wrapper = renderComponent(mutate)
    const searchTerms = {
      searchTerm: 'some-term'
    }
    wrapper.vm.filter(searchTerms)
    expect(mutate).toHaveBeenCalledWith({
      mutation: SET_SEARCH_TERMS,
      variables: {
        data: expect.objectContaining({
          ...searchTerms
        })
      }
    })
  })
  it('resets the page to one when search terms are updated', () => {})
})

const renderComponent = (mutate = () => {}) => {
  const wrapper = mount(ProductFilters, {
    data: () => ({
      searchTerms: {
        department_id: 1,
        category_id: 1
      },
      departments: [{
        department_id: 1
      }]
    }),
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
  return wrapper
}