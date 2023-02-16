// Import
import axios from 'axios'

// Create
const service = axios.create({
    baseURL: "http://localhost:8000/api/"
})

// Token
const token = localStorage.getItem('token')
if (token) {
    service.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

// Export axios
export default service