<template>
    <div class="profile-container">
        <header class="profile-header">
            <div class="index-info">
                <div class="profile-avatar">
                    <img :src="userProfile.avatar" alt="加载失败！">
                </div>
                <div class="profile-info">
                    <div class="profile-name">
                        <span class="profile-nickname">{{userProfile.nickname}}</span>
                        <span class="profile-username">用户名: {{userProfile.username}}</span>
                    </div>
                    <div class="profile-uid">
                        uid: {{uid}}
                    </div>
                </div>
            </div>
        </header>
        <section class="profile-main">
            <div class="profile-signature">
                <i class="fa fa-pencil" aria-hidden="true"></i>{{userProfile.signature}}
            </div>
        </section>
        <footer class="profile-footer" v-if="isFriend">
            <button class="video" @click="handleVideo">视频通话</button>
            <button class="message" @click="handleMessage">发消息</button>
        </footer>
        <footer class="profile-footer" v-else>
            <button class="buddy" @click="handleBuddy">加好友</button>
        </footer>
    </div>
</template>

<script>
    import {
        computed,
        onMounted,
        reactive,
        ref,
        watch
    } from 'vue'

    import {
        useStore
    } from 'vuex'

    import {
        useRouter
    } from 'vue-router'

    import {
        profile
    } from '../services'

    import {
        copy
    } from '@/utils/util'
    import Socket from '../services/ws'

    export default {
        props: ['uid'],
        setup(props) {
            const store = useStore()

            const router = useRouter()

            const isFriend = ref(false)

            const userProfile = reactive({})

            const profilePool = new Map()

            const friends = computed(() => store.state.friends)

            const socket = new Socket(store.state.user.uid)

            onMounted(() => {
                initProfile()
            })

            function handleVideo() {
                store.commit('CALL_VIDEO_CHAT')
            }

            function handleMessage() {
                store.commit('ADD_CONVERSATION_ITEM', {
                    uid: props.uid,
                    nickname: userProfile.nickname,
                    avatar: userProfile.avatar,
                    message: userProfile.message
                })

                router.push(`/chat/${props.uid}`)
            }

            function handleBuddy() {
                alert('发送添加好友请求');
                socket.newBuddy({
                    from: store.state.user.uid,
                    username: store.state.user.username,
                    to: parseInt(props.uid)
                })
            }

            function initProfile() {
                if (profilePool.has(props.uid)) {
                    copy(userProfile, profilePool.get(props.uid))
                } else {
                    profile(props.uid)
                        .then((responese) => {
                            copy(userProfile, responese.data.profile)

                            profilePool.set(props.uid, responese.data.profile)
                        })
                }

                setTimeout(() => {
                    isFriend.value = false
                    
                    for (let i = 0; i < friends.value.length; i++) {
                        if (friends.value[i].friend_id == props.uid) {
                            isFriend.value = true
                            break
                        }
                    }
                }, 200)
            }

            watch(() => props.uid, () => {
                initProfile()
            })

            return {
                userProfile,
                isFriend,
                handleVideo,
                handleMessage,
                handleBuddy
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/value.scss';

    .profile-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .profile-header {
        width: 100%;
        height: 30vh;
        background-color: $main-border-color;
        background-image: url(https://i.loli.net/2020/09/11/RDoc5C3uTtQ9lUp.jpg);
        background-position: center;
        background-size: cover;
        position: relative;

        .index-info {
            width: 100%;
            height: 6rem;
            padding: 0 4rem;
            box-sizing: border-box;
            display: flex;
            position: absolute;
            bottom: -3rem;
        }

        .profile-avatar {
            width: 6rem;
            margin-right: 1.2rem;

            img {
                width: 100%;
                border-radius: 10px;
                background-color: #eee;
            }
        }

        .profile-info {
            height: 100%;
            text-align: left;

            .profile-name {
                color: white;
                position: relative;
                top: -.6rem;

                .profile-nickname {
                    font-size: 26px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    line-height: 2rem;
                    display: block;
                }
            }

            .profile-uid {
                color: #464646;
            }
        }
    }

    .profile-main {
        width: 100%;
        flex: 1;
        padding: 4.6rem 4.2rem 0;
        box-sizing: border-box;

        .profile-signature {
            text-align: left;

            i {
                margin-right: .8rem;
            }
        }
    }

    .profile-footer {
        width: 100%;
        height: 10vh;
        display: flex;
        justify-content: center;
        align-items: center;

        button {
            width: 10rem;
            padding: .8rem 0;
            border: none;
            outline: none;
            margin: 0 2rem;
            transition: all .2s;
        }

        .video {
            border: 1px solid $main-border-color;
            background-color: white;

            &:hover {
                color: $main-blue;
                border: 1px solid $main-blue;
            }
        }

        .buddy,
        .message {
            color: white;
            background-color: $main-blue;

            &:hover {
                background-color: transparentize($main-blue, .25);
            }
        }
    }

    @media screen and (max-width: $tablet) {
        .profile-header .index-info {
            padding: 0 2rem;
        }
    }
</style>