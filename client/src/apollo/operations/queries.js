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
  query getProducts($data: ProductSearchFields!) {
    products(data: $data) {
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

const GET_PRODUCT = gql`
  query getProduct($id: String!) {
    product (id: $id) {
      product_id
      name
      description
      price
      discounted_price
      image
      image_2
    }
  }
`

const GET_CURRENT_PRODUCT = gql`
  query getCurrentProduct {
    currentProduct @client {
      product_id
      name
      description
      price
      discounted_price
      image
      image_2
    }
  }
`

const GET_SEARCH_TERMS = gql`
  query getSearchTerms {
    searchTerms @client {
      page
      limit
      query_string
    }
  }
`

export { GET_ME, GET_CURRENT_CUSTOMER, GET_OVERLAY, GET_PRODUCTS, GET_PRODUCT, GET_CURRENT_PRODUCT, GET_SEARCH_TERMS }