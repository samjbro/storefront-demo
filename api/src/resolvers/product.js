import axios from 'axios'
const endpoint = process.env.REST_API_ENDPOINT

export default {
  attributes: async parent => {
    try {
      const { data } = await axios.get(`${endpoint}/attributes/inProduct/${parent.product_id}`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  reviews: async parent => {
    try {
      const { data } = await axios.get(`${endpoint}/products/${parent.product_id}/reviews`)
      console.log(data)
      return data
    } catch (e) {
      throw new Error(e)
    }
  }
}