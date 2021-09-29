import axios from 'axios'
import store from '../store'

const http = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

http.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            store.dispatch('doLogout')
        }
        return Promise.reject(error)
    }
)

export default http