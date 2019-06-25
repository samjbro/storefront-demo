import axios from 'axios'
const endpoint = process.env.REST_API_ENDPOINT

export default {
  attributes: async parent => {
    try {
      const {
        data
      } = await axios.get(`${endpoint}/attributes/inProduct/${parent.product_id}`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  reviews: async parent => {
    try {
      const {
        data
      } = await axios.get(`${endpoint}/products/${parent.product_id}/reviews`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  locations: async parent => {
    try {
      const {
        data
      } = await axios.get(`${endpoint}/products/${parent.product_id}/locations`)
      const product = data[0]
      return {
        department: {
          department_id: product.department_id,
          name: product.department_name
        },
        category: {
          category_id: product.category_id,
          name: product.category_name
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}