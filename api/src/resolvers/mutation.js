import axios from 'axios'
import moment from 'moment'

const endpoint = process.env.REST_API_ENDPOINT

export default {
  login: async (parent, { data }, { request }, info) => {
    const errorMessage = 'Unable to login'
    try {
      const res = await axios.post(`${endpoint}/customers/login`, data)
      const { accessToken, customer } = res.data
      return {
        token: accessToken,
        customer
      }
    } catch(err) {
      throw new Error(errorMessage)
    }
  },
  register: async (parent, { data }, { request }, info) => {
    try {
      const res = await axios.post(`${endpoint}/customers`, data)
      const { accessToken, customer } = res.data
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
  }
}