import axios from 'axios'
import { fakeDelay } from '../utils'

const endpoint = process.env.REST_API_ENDPOINT

export default {
  me: async (parent, args, { request }, info) => {
    try {
      const { data } = await axios.get(`${endpoint}/customer`, {
        headers: {
          'user-key': request.req.headers['user-key']
        }
      })
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  products: async (parent, { data: { page, limit, query_string } }, { request }, info) => {
    // await fakeDelay(1000)
    try {
      const url = query_string
       ? `${endpoint}/products/search`
       : `${endpoint}/products`
      const { data } = await axios.get(url, {
        params: {
          page, limit, query_string
        }
      })
      return {
        count: data.count,
        product_list: data.rows
      }
    } catch (e) {
      throw new Error(e)
    }
  },
  product: async (parent, { id }) => {
    // await fakeDelay(1000)
    try {
      const { data } = await axios.get(`${endpoint}/products/${id}`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  }
}