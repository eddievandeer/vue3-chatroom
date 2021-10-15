import { createStore } from 'vuex'
import { login, setToken, getFriends, userAvatar, register } from '../services'
import { copy } from '../utils/util'

export default createStore({
    state: {
        user: null,
        conversations: [],
        friends: [],
        unread: {},
        lastMessage: {},
        newBuddy: [],
        calling: false
    },
    mutations: {
        SET_USER_DATA(state, data) {
            state.user = data
            localStorage.setItem('user', JSON.stringify(data))
            setToken(`Bearer ${data.token}`)
        },
        CLEAR_USER_DATA() {
            localStorage.removeItem('user')
            localStorage.removeItem('conversations')
            localStorage.removeItem('unread')
            location.reload()
        },
        SET_CONVERSATION_DATA(state, data) {
            state.conversations.push(...data)
        },
        ADD_CONVERSATION_ITEM(state, item) {
            let isExist = false

            for (let i = 0; i < state.conversations.length; i++) {
                if (state.conversations[i].uid == item.uid) {
                    isExist = true
                    break
                }
            }

            if (!isExist) {
                state.conversations.push(item)
                localStorage.setItem('conversations', JSON.stringify(state.conversations))
            }
        },
        SET_FRIENDS(state, { friendList }) {
            state.friends.splice(0, state.friends.length)
            state.friends.push(...friendList)
        },
        SET_FRIEND_ONLINE_STATUS(state, { status, index }) {
            state.friends[index].online = status
        },
        SET_UNREAD_DATA(state, unread) {
            copy(state.unread, unread)
        },
        ADD_NEW_MESSAGE(state, { uid, unread }) {
            if (state.unread[uid] != undefined) {
                state.unread[uid].push(unread)
            } else {
                state.unread[uid] = [unread]
            }
            localStorage.setItem('unread', JSON.stringify(state.unread))
        },
        READ_NEW_MESSAGE(state, uid) {
            delete state.unread[uid]
            localStorage.setItem('unread', JSON.stringify(state.unread))
        },
        SET_LAST_MESSAGE(state, { uid, last }) {
            if (state.lastMessage[uid] != last) {
                state.lastMessage[uid] = last
                localStorage.setItem('lastMessage', JSON.stringify(state.lastMessage))
            }
        },
        SET_LAST_MESSAGES_DATA(state, lastMessages) {
            copy(state.lastMessage, lastMessages)
        },
        NEW_BUDDY(state, buddy) {
            state.newBuddy.push(buddy)
        },
        RESOLVE_BUDDY(state, confirm) {
            if (confirm.check) {
                state.newBuddy[confirm.index].accepted = true
            } else {
                state.newBuddy[confirm.index].rejected = true
            }
        },
        CALL_VIDEO_CHAT(state) {
            state.calling = true
        },
        HANG_UP_VIDEO_CHAT(state) {
            state.calling = false
        }, 
        TOGGLE_VIDEO_CHAT(state) {
            state.calling = !state.calling
        }
    },
    actions: {
        async login({ commit }, credentials) {
            const response = await login(credentials)
            console.log(response)
            commit('SET_USER_DATA', response.data)
        },
        async register({ commit }, credentials) {
            const response = await register(credentials)

            commit('SET_USER_DATA', response.data)
        },
        logout({ commit }) {
            commit('CLEAR_USER_DATA')
        },
        async friendList({ commit, state }) {
            const response = await getFriends(state.user.uid)

            commit('SET_FRIENDS', response.data)
        },
        async addNewBuddy({ commit }, buddy) {
            const response = await userAvatar(buddy.from)

            buddy.avatar = response.data.avatar

            commit('NEW_BUDDY', buddy)
        }
    },
    modules: {}
})