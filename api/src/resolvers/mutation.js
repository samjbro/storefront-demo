import axios from 'axios'
import moment from 'moment'

const endpoint = process.env.REST_API_ENDPOINT

export default {
  login: async (parent, { data }, { request, prisma }, info) => {
    const errorMessage = 'Unable to login'
    try {
      const res = await axios.post(`${endpoint}/customers/login`, data)
      const { accessToken, customer } = res.data
      const userExists = await prisma.query.customer({
        where: {
          turing_id: customer.customer_id
        }
      })
      if (!userExists) {
        const { data: { cart_id }} = await axios.get(`${endpoint}/shoppingcart/generateUniqueId`)
        const cart = await prisma.mutation.createCart({
          data: {
            turing_id: cart_id
          }
        })
        await prisma.mutation.createCustomer({
          data: {
            turing_id: customer.customer_id,
            cart: {
              connect: {
                id: cart.id
              }
            }
          }
        })
      }
      return {
        token: accessToken,
        customer
      }
    } catch(err) {
      throw new Error(errorMessage)
    }
  },
  register: async (parent, { data }, { prisma, request }, info) => {
    try {
      const res = await axios.post(`${endpoint}/customers`, data)
      const { accessToken, customer } = res.data
      
      const { data: { cart_id }} = await axios.get(`${endpoint}/shoppingcart/generateUniqueId`)
      const cart = await prisma.mutation.createCart({
        data: {
          turing_id: cart_id
        }
      })
      await prisma.mutation.createCustomer({
        data: {
          turing_id: customer.customer_id,
          cart: {
            connect: {
              id: cart.id
            }
          }
        }
      })

      return {
        token: accessToken,
        customer
      }
    } catch (err) {
      throw new Error(err.response.data.error.message)
    }
  },
  addReview: async (parent, { data }, { request }) => {
    try {
      await axios.post(
        `${endpoint}/products/${data.product_id}/reviews`,
        data,
        {
         headers: {
          'user-key': request.req.headers['user-key']
         }
        }
      )

      return {
        review: data.review,
        rating: data.rating,
        created_on: moment().utcOffset('-0500').format("YYYY-MM-DD HH:mm:ss")
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  addToCart: async (parent, { data: { cart_id, product_id, attributes, quantity } }) => {
    try {
      const { data } = await axios.post(
        `${endpoint}/shoppingcart/add`,
        { cart_id, product_id, attributes }
      )
      console.log({data})
      const newItem = data.find(item => item.product_id === product_id)
      await axios.put(
        `${endpoint}/shoppingcart/update/${newItem.item_id}`,
        { quantity }
      )
      const [size, color] = newItem.attributes.split(', ')
      return {
        item_id: newItem.item_id,
        product: {
          ...newItem
        },
        color,
        size,
        quantity
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}