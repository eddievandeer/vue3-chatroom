import http from './http'

export function setToken(token) {
    http.defaults.headers.common['Authorization'] = token
}

export function login(credentials) {
    return http.post('/user/login', credentials)
}

export function register(credentials) {
    return http.post('/user/register', credentials)
}

export function getFriends(uid) {
    return http.get('/user/friends', {
        params: {
            uid
        }
    })
}

export function profile(uid) {
    return http.get('/user/profile', {
        params: {
            uid
        }
    })
}

export function userAvatar(uid) {
    return http.get('/user/avatar', {
        params: {
            uid
        }
    })
}

export function searchUser(uid) {
    return http.get('/user/search', {
        params: {
            uid
        }
    })
}

export function getMessages(from_uid, to_uid) {
    return http.get('/chat/message', {
        params: {
            from_uid,
            to_uid
        }
    })
}

export function sendMessage(from_uid, to_uid, message) {
    return http.post('/chat/send', {
        from_uid,
        to_uid,
        message
    })
}

function test() {
    console.log(http);
    http.get('/dashboard').then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err.response);
    })
}