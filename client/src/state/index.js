export default {
  currentCustomer: null,
  overlay: {
    __typename: 'Overlay',
    showing: false,
    view: 'register'
  },
  currentProduct: null,
  searchTerms: {
    __typename: 'SearchTerms',
    page: 1,
    limit: 6,
    query_string: ''
  }
}