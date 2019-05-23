import gql from 'graphql-tag'

export default {
  fullCart: gql`
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
}