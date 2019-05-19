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
  setSearchTerms: (_, { data: { page, limit, query_string }}, { cache }) => {
    const { searchTerms } = cache.readQuery({ query: GET_SEARCH_TERMS})
    const newTerms = searchTerms
    if (page) newTerms.page = page
    if (limit) newTerms.limit = limit
    if (typeof query_string === 'string') newTerms.query_string = query_string
    cache.writeData({
      data: {
        searchTerms: newTerms
      }
    })
    return newTerms
  }
}