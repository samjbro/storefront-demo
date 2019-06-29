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
  it('can clear the search', () => {
    const search = 'string-to-be-cleared'
    const clearedSearch = ''
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate,
      data: {
        search
      }
    })
    wrapper.vm.clear()
    expect(mutate).toHaveBeenCalledWith({
      mutation: SET_SEARCH_TERMS,
      variables: {
        data: expect.objectContaining({
          query_string: clearedSearch
        })
      }
    })
  })
  it('can request a department by id', () => {
    const mutate = jest.fn()
    const wrapper = renderComponent({
      mutate,
    })
    const departmentId = '999'
    wrapper.vm.showDepartment(departmentId)
    expect(mutate).toHaveBeenCalledWith({
      mutation: SET_SEARCH_TERMS,
      variables: {
        data: expect.objectContaining({
          department_id: parseInt(departmentId)
        })
      }
    })
  })
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