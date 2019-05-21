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
    limit: 2,
    query_string: '',
    department_id: 0,
    category_id: 0
  }
}