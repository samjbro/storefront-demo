import gql from 'graphql-tag'

const GET_ME = gql`
  query getMe {
    me {
      customer_id
      name
      email
    }
  }
`

const GET_CURRENT_CUSTOMER = gql`
  query getCurrentCustomer {
    currentCustomer @client {
      customer_id
      name
      email
    }
  }
`

const GET_OVERLAY = gql`
  query getOverlay {
    overlay @client {
      showing
      view
    }
  }
`

const GET_PRODUCTS = gql`
  query getProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      count
      product_list {
        product_id
        name
        price
        thumbnail
      }
    }
  }
`

export { GET_ME, GET_CURRENT_CUSTOMER, GET_OVERLAY, GET_PRODUCTS }