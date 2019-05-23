import axios from 'axios'

const endpoint = process.env.REST_API_ENDPOINT

export default {
  cart: async (parent, args, { prisma, request })  => {
    try {
      const { cart: { turing_id } } = await prisma.query.customer({
        where: {
          turing_id: parent.customer_id
        }
      }, '{ cart { turing_id } }')
      const cartRes = await axios.get(`${endpoint}/shoppingcart/${turing_id}`)
      return({
        cart_id: turing_id,
        items: cartRes.data.map((product, index) => {
          return {
            // cart_item_id: index + 1,
            product: {
              product_id: product.product_id,
              name: product.name,
              image: product.image,
              price: product.price
            },
            quantity: product.quantity,
            size: product.attributes.split(', ')[0],
            color: product.attributes.split(', ')[1]
          }
        })
      })
    } catch(e) {
      throw new Error(e)
    }
  }
}