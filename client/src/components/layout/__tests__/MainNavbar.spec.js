import {
  mount
} from '@vue/test-utils'

import MainNavbar from '../MainNavbar'
import {
  SET_SEARCH_TERMS
} from '../../../apollo/operations/mutations';

describe('MainNavbar', () => {
  it('can submit a new search', () => {
    const search = 'some-string'
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate,
      data: {
        search
      }
    })
    wrapper.vm.submitSearch()
    expect(mutate).toHaveBeenCalledWith({
      mutation: SET_SEARCH_TERMS,
      variables: {
        data: expect.objectContaining({
          query_string: search
        })
      }
    })
  })
  it('can clear the search', () => {})
  it('can request a department by id', () => {})
})

const renderComponent = ({
  mutate,
  data
}) => {
  return mount(MainNavbar, {
    data: () => ({
      searchTerms: {
        department_id: 1
      },
      department: {
        department_id: 1
      },
      ...data
    }),
    mocks: {
      $apollo: {
        mutate
      }
    }
  })
}