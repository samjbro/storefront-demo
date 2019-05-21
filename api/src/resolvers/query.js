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
  products: async (parent, { data: { page, limit, query_string, department_id, category_id } }, { request }, info) => {
    // await fakeDelay(1000)
    let url = `${endpoint}/products`
    if (query_string) {
      url += `/search`
    } else if (department_id) {
      url += `/inDepartment/${department_id}`
    } else if (category_id) {
      url += `/inCategory/${category_id}`
    } 
    try {
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
  },
  departments: async () => {
    try {
      const { data } = await axios.get(`${endpoint}/departments`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  categories: async () => {
    try {
      const { data } = await axios.get(`${endpoint}/categories`)
      return data.rows
    } catch (e) {
      throw new Error(e)
    }
  }
}