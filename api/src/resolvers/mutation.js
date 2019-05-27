import axios from 'axios'
import moment from 'moment'

import { getStripeToken } from '../utils'

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
      console.log(request.req.headers['user-key'])
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
      console.log(err)
      throw new Error(err)
    }
  },
  addToCart: async (parent, { data: { cart_id, product_id, attributes, quantity } }) => {
    try {
      const { data } = await axios.post(
        `${endpoint}/shoppingcart/add`,
        { cart_id, product_id, attributes }
      )
      const newItem = data.find(item => {
        return item.product_id === product_id && item.attributes === attributes
      })
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
  },
  updateCart: async (parent, { data: { item_id, quantity }}) => {
    try {
      const { data } = await axios.put(
        `${endpoint}/shoppingcart/update/${item_id}`,
        { quantity }
      )
      const item = data.find(item => item.item_id === item_id)
      const [size, color] = item.attributes.split(', ')
      return {
        item_id: item.item_id,
        product: {
          ...item,
        },
        color,
        size,
        quantity
      }
    } catch (e) {
      throw new Error(e)
    }
  },
  removeCartItem: async (parent, { item_id }) => {
    try {
      await axios.delete(
        `${endpoint}/shoppingcart/removeProduct/${item_id}`,
      )
      return true
    } catch (e) {
      throw new Error(e)
    }
  },
  addCustomerAddress: async (parent,
    { data: { firstName, lastName, address, city, state, zipCode, shippingRegionId, shippingCountry } },
    { request }) => {
    try {
      console.log({shippingCountry})
      // The API route doesn't accept first and last names as variables yet
      const { data } = await axios.put(
        `${endpoint}/customers/address`,
        {
          address_1: address,
          city,
          region: state,
          postal_code: zipCode,
          country: shippingCountry,
          shipping_region_id: parseInt(shippingRegionId)
        },
        {
          headers: {
            'user-key': request.req.headers['user-key']
          }
        }
      )
      return data
    } catch (e) {
      console.log(e.response.data.error)
      throw new Error(e)
    }
  },
  createOrder: async (parent, { data: { shippingId, cartId, cardData } }, { request }) => {
    try {
      const token = await getStripeToken(cardData)
console.log({token})
      const orderPostResponse = await axios.post(`${endpoint}/orders`,
       {
        shipping_id: shippingId,
        cart_id: cartId
      },
      {
        headers: {
          'user-key': request.req.headers['user-key']
        }
      })
      const orderId = orderPostResponse.data.orderId
      // The orders post route only returns the order id, so to get the total order amount we must make another request
      const orderGetResponse = await axios.get(`${endpoint}/orders/shortDetail/${orderId}`, {
        headers: {
          'user-key': request.req.headers['user-key']
        }
      })
      const totalAmount = orderGetResponse.data.total_amount

      const paymentResponse = await axios.post(`${endpoint}/stripe/charge`, {
        stripeToken: token.id,
        order_id: orderId,
        description: 'Test payment to Stripe',
        // Convert float into integer
        amount: parseInt(totalAmount.replace('.', '')),
        currency: 'GBP'
      })

      console.log({paymentResponse})

      return paymentResponse
    } catch (e) {
      console.log(e)
      console.log(e.response.data.error)
      throw new Error(e)
    }
  }
}