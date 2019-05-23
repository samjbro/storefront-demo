import gql from 'graphql-tag'

const SHOW_OVERLAY = gql`
  mutation showOverlay($view: String!) {
    showOverlay(view: $view) @client
  }
`

const CLOSE_OVERLAY = gql`
  mutation closeOverlay {
    closeOverlay @client
  }
`

const LOG_IN = gql`
  mutation login($data: LoginCustomerInput!) {
    login(data: $data) {
      token
      customer {
        customer_id
        name
        email
        cart {
          cart_id
          products {
            name
          }
        }
      }
    }
  }
`

const REGISTER = gql`
  mutation register($data: RegisterCustomerInput!) {
    register(data: $data) {
      token
      customer {
        customer_id
        name
        email
        cart {
          cart_id
          products {
            name
          }
        }
      }
    }
  }
`

const SET_CURRENT_CUSTOMER = gql`
  mutation setCurrentCustomer($customer: Customer!) {
    setCurrentCustomer(customer: $customer) @client
  }
`

const SET_CURRENT_PRODUCT = gql`
  mutation setCurrentProduct($product: Product!) {
    setCurrentProduct(product: $product) @client
  }
`

const SET_SEARCH_TERMS = gql`
  mutation setSearchTerms($data: ProductSearchFields) {
    setSearchTerms(data: $data) @client
  }
`

const ADD_REVIEW = gql`
  mutation addReview($data: AddReviewInput!) {
    addReview(data: $data) {
      review
      rating
      created_on
    }
  }
`

const ADD_TO_CART = gql`
  mutation addToCart($data: AddToCartInput!) {
    addToCart(data: $data) {
      product {
        name
        price
        image
      }
      color
      size
      quantity
    }
  }
`

export { SHOW_OVERLAY, CLOSE_OVERLAY, LOG_IN, REGISTER, SET_CURRENT_CUSTOMER, SET_CURRENT_PRODUCT, SET_SEARCH_TERMS, ADD_REVIEW, ADD_TO_CART }