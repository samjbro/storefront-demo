import gql from 'graphql-tag'
import fragments from './fragments'

const GET_ME = gql`
  query getMe {
    me {
      ...customerInfo
    }
  }
  ${fragments.customerInfo}
`

const GET_CURRENT_CUSTOMER = gql`
  query getCurrentCustomer {
    currentCustomer @client {
      ...customerInfo
    }
  }
  ${fragments.customerInfo}
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
      # discounted_price
      image
      image_2
      attributes {
        attribute_value_id
        attribute_name
        attribute_value
      }
      reviews {
        name
        review
        rating
        created_on
      }
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
      #discounted_price
      image
      image_2
      attributes {
        attribute_value_id
        attribute_name
        attribute_value
      }
      reviews {
        name
        review
        rating
        created_on
      }
    }
  }
`

const GET_SEARCH_TERMS = gql`
  query getSearchTerms {
    searchTerms @client {
      page
      limit
      query_string
      department_id
      category_id
    }
  }
`

const GET_DEPARTMENTS = gql`
  query getDepartments {
    departments {
      department_id
      name
      description
    }
  }
`

const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      category_id
      name
      description
    }
  }
`

const GET_SHIPPING_REGIONS = gql`
  query getShippingRegions {
    shippingRegions {
      shipping_region_id
      shipping_region
      shipping_types {
        shipping_id
        shipping_type
        shipping_cost
      }
    }
  }
`

// const GET_CART = gql`
//   query getCart {
//     cart {
//       cart_id
//       items {
//         product {
//           name
//         }
//         color
//         size
//         quantity
//       }
//     }
//   }
// `

const GET_SHIPPING_TYPE = gql`
  query getShippingType {
    shippingType @client {
      shipping_id
      shipping_type
      shipping_cost
    }
  }
`



export { GET_ME, GET_CURRENT_CUSTOMER, GET_OVERLAY, GET_PRODUCTS, GET_PRODUCT, GET_CURRENT_PRODUCT, GET_SEARCH_TERMS, GET_DEPARTMENTS, GET_CATEGORIES, GET_SHIPPING_REGIONS, GET_SHIPPING_TYPE }