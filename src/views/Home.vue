<template>
    <div class="layout-home">
        <VideoCall></VideoCall>
        <router-view></router-view>
    </div>
</template>

<script>
    import {
        useRoute
    } from 'vue-router'
    import {
        useStore
    } from 'vuex'

    import Socket from '../services/ws'
    import VideoCall from '../components/ui/VideoCall'
import { watch } from '@vue/runtime-core'

    export default {
        components: {
            VideoCall
        },
        setup() {
            const store = useStore()

            const route = useRoute()

            const socket = new Socket(store.state.user.uid)

            socket.addHandler('new server message', (data) => {
                if (route.name != 'Chat' || (route.name == 'Chat' && route.params.uid != data.from)) {
                    store.commit('ADD_NEW_MESSAGE', {
                        uid: data.from,
                        unread: data.message
                    })
                    store.commit('ADD_CONVERSATION_ITEM', {
                        uid: data.from,
                        nickname: data.nickname ,
                        avatar: data.avatar
                    })
                    console.log(store.state.unread);
                }

                store.commit('SET_LAST_MESSAGE', {
                    uid: data.from,
                    last: data.message
                })
            })

            socket.addHandler('check buddy', (data) => {
                console.log(data);
                store.dispatch('addNewBuddy', data)
            })

            socket.addHandler('add buddy', () => {
                setTimeout(() => {
                    store.dispatch('friendList')
                }, 500);
            })

            socket.addHandler('online status', (status) => {
                console.log(status);
                if (Array.isArray(status)) {
                    status.forEach((s, i) => {
                        store.commit('SET_FRIEND_ONLINE_STATUS', {
                            status: s,
                            index: i
                        })
                    })
                } else {
                    const friends = store.state.friends

                    for (let i = 0; i < friends.length; i++) {
                        if (friends[i].friend_id == status.uid) {
                            store.commit('SET_FRIEND_ONLINE_STATUS', {
                                status: status.status,
                                index: i
                            })
                        }
                    }
                }
            })

            store.dispatch('friendList')

            watch(() => route.path, () => {
                store.commit('HANG_UP_VIDEO_CHAT')
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/value.scss';

    .layout-home {
        flex: 1;
        height: 100vh;
        padding-top: $header-height;
        overflow: hidden;
        padding-left: $menu-width;
        box-sizing: border-box;
    }

    @media screen and (max-width: $tablet) {
        .layout-home {
            padding-left: 0;
        }
    }
</style>