import gql from 'graphql-tag'

export default {
  fullCart: gql`
    fragment fullCart on Cart {
      cart_id
      items {
        # cart_item_id
        product {
          name
        }
      }
    }
  `
}