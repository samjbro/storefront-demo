import { GET_SEARCH_TERMS } from "../operations/queries";

let overlayHidden = true

export default {
  closeOverlay (parent, data, { cache }) {          
    cache.writeData({
      data: {
        overlay: {
          __typename: 'Overlay',
          showing: false,
        }
      }
    })
    return null
  },
  showOverlay (parent, { view }, { cache }) {
    cache.writeData({
      data: {
        overlay: {
          __typename: 'Overlay',
          showing: true,
          view
        }
      }
    })
    return null
  },
  setCurrentCustomer: async (_, { customer }, { cache }) => {
    await cache.writeData({
      data: {
        currentCustomer: customer
      }
    })
    return null
  },
  setCurrentProduct: async (_, { product }, { cache }) => {
    await cache.writeData({
      data: {
        currentProduct: product
      }
    })
    return null
  },
  setSearchTerms: (_, { data: { page, limit, query_string, department_id, category_id }}, { cache }) => {
    const { searchTerms } = cache.readQuery({ query: GET_SEARCH_TERMS})
    const newTerms = {
      __typename: searchTerms.__typename,
      page: page || 1,
      limit: limit || searchTerms.limit,
      department_id: department_id || 0,
      category_id: category_id || 0,
      // category_id: typeof category_id === 'number' ? category_id : searchTerms.category_id,
      query_string: ''
    }
    // console.log({department_id, searchTerms})
    // if (searchTerms.department_id && department_id !) {
    //   newTerms.department_id = 0
    // }
    // if (category_id === searchTerms.category_id) {
    //   newTerms.category_id = 0
    // }
    // console.log({newTerms})
    if (
      (!newTerms.department_id || newTerms.department_id === searchTerms.department_id)
      && (!newTerms.category_id || newTerms.category_id === searchTerms.category_id)

    ) {
      newTerms.query_string = typeof query_string === 'string'
        ? query_string
        : searchTerms.query_string
    }

    cache.writeData({
      data: {
        searchTerms: newTerms
      }
    })
    return newTerms
  }
}