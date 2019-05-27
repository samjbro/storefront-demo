import axios from 'axios'

const endpoint = process.env.REST_API_ENDPOINT

export default {
  shipping_types: async (parent) => {
    try{
      const { data } = await axios.get(`${endpoint}/shipping/regions/${parent.shipping_region_id}`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  }
}