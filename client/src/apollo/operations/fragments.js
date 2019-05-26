import gql from 'graphql-tag'

const fullCart = gql`
fragment fullCart on Cart {
  cart_id
  items {
    item_id
    size
    quantity
    color
    product {
      product_id
      name
      price
      image
    }
  }
}
`

const customerInfo = gql`
  fragment customerInfo on Customer {
      customer_id
      name
      email
      cart {
        ...fullCart
      }
      address {
        address
        city
        state
        zipCode
        shippingRegion {
          shipping_region_id
          shipping_region
          shipping_types {
            shipping_id
            shipping_type
            shipping_cost
          }
        }
      }
    }
    ${fullCart}
`

export default {
  fullCart,
  customerInfo
}