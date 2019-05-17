import axios from 'axios'

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
      console.log(err)
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
  }
}