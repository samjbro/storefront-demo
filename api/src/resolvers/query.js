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
  products: async (parent, { page, limit }, { request }, info) => {
    await fakeDelay(1000)
    try {
      console.log({page, limit})
      const { data } = await axios.get(`${endpoint}/products`, {
        params: {
          page, limit
        }
      })
      console.log({data})
      return {
        count: data.count,
        product_list: data.rows
      }
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }
}