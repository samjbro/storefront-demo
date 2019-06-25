import axios from 'axios'
const endpoint = process.env.REST_API_ENDPOINT

export default {
  categories: async parent => {
    try {
      const {
        data
      } = await axios.get(`${endpoint}/categories/inDepartment/${parent.department_id}`)
      return data
    } catch (e) {
      throw new Error(e)
    }
  }
}