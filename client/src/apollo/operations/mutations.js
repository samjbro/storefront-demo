import gql from 'graphql-tag'
import fragments from './fragments'

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
          ...fullCart
        }
      }
    }
  }
  ${fragments.fullCart}
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
          ...fullCart
        }
      }
    }
  }
  ${fragments.fullCart}
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
      item_id
      product {
        product_id
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

const UPDATE_CART = gql`
  mutation updateCart($data: UpdateCartInput!) {
    updateCart(data: $data) {
      product {
        # product_id
        name
        price
        # We can't query the image because the API response doesn't return an image or a product_id, making it more difficult than it's worth to retrieve
        # image
      }
      color
      size
      quantity
    }
  }
`

const REMOVE_CART_ITEM = gql`
  mutation removeCartItem($item_id: Int!) {
    removeCartItem(item_id: $item_id)
  }
`

export { SHOW_OVERLAY, CLOSE_OVERLAY, LOG_IN, REGISTER, SET_CURRENT_CUSTOMER, SET_CURRENT_PRODUCT, SET_SEARCH_TERMS, ADD_REVIEW, ADD_TO_CART, UPDATE_CART, REMOVE_CART_ITEM }