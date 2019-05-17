import axios from 'axios'

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
      console.log(e)
      throw new Error(e)
    }
  }
}