import axios from 'axios'

const http = axios.create({
    baseURL: '/api',
    withCredentials = true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

function login(params) {
    http.post('/login', params).then((response) => {
        console.log(response);
    })
}

export {
    login
}