<template>
    <div class="chat-main">
        <div class="chat-content" ref="chat">
            chat ID: {{uid}}
            <ChatItem v-for="(chatMessage, index) in chatMessages" :key="index" :message="chatMessage"></ChatItem>
        </div>
        <ChatInput v-model="msg.message">
            <button class="chat-send" @click="handlePost">发送 <i class="fa fa-paper-plane"
                    aria-hidden="true"></i></button>
        </ChatInput>
    </div>
</template>

<script>
    import {
        nextTick,
        onMounted,
        reactive,
        ref,
        watch
    } from 'vue'

    import {
        useStore
    } from 'vuex'

    import {
        useRoute
    } from 'vue-router'

    import ChatItem from './items/ChatItem.vue'
    import ChatInput from './ui/ChatInput'
    import Socket from '../services/ws'
    import {
        userAvatar,
        getMessages
    } from '../services'

    export default {
        props: ['uid'],
        components: {
            ChatItem,
            ChatInput
        },
        setup(props) {
            const store = useStore()
            const route = useRoute()

            const chat = ref()

            const chatMessages = reactive([])

            const msg = reactive({
                from: store.state.user.uid,
                to: parseInt(props.uid),
                message: '',
                fromAvatar: '',
                toAvatar: ''
            })

            const socket = new Socket(msg.from)

            onMounted(() => {
                initAvatar()

                initMessage()

                socket.addHandler('server message', (data) => {
                    console.log(route.params.uid, data.from);
                    if (route.params.uid == data.from) {
                        const _message = data

                        chatMessages.push(_message)
                    }
                })
            })

            function handlePost() {
                if (msg.message.length > 0 || msg.message !== '') {
                    chatMessages.push({
                        from_uid: store.state.user.uid,
                        to_uid: msg.to,
                        message: msg.message,
                        avatar: msg.fromAvatar,
                        send_time: new Date().toLocaleString()
                    })

                    store.commit('SET_LAST_MESSAGE', {
                        uid: props.uid,
                        last: msg.message
                    })

                    socket.postMsg(msg.to, store.state.user.nickname, msg.message, msg.fromAvatar)

                    msg.message = ''
                } else {
                    alert('消息不能为空！')
                }
            }

            function initMessage() {
                getMessages(msg.from, msg.to).then((response) => {
                    const _messages = JSON.parse(response.data.messages)

                    store.commit('SET_LAST_MESSAGE', {
                        uid: props.uid,
                        last: _messages.length > 0 ? _messages[_messages.length - 1].message : ''
                    })

                    chatMessages.push(..._messages)
                })
            }

            function initAvatar() {
                userAvatar(msg.from).then((response) => {
                    msg.fromAvatar = response.data.avatar
                })
                userAvatar(msg.to).then((response) => {
                    msg.toAvatar = response.data.avatar
                })
            }

            watch(() => chatMessages.length, () => {
                nextTick(() => {
                    chat.value.scrollTop = chat.value.scrollHeight
                })
            })

            watch(() => props.uid, (newUid) => {
                msg.to = parseInt(newUid)
                chatMessages.splice(0, chatMessages.length)

                initMessage()
            })

            return {
                msg,
                chat,
                chatMessages,
                handlePost
            }
        }
    }
</script>

<style lang="scss" scoped>
    @use "sass:color";
    @import '../style/value.scss';

    .chat-main {
        height: 100%;
        background-color: #F5F6F7;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .chat-content {
        flex: 5;
        overflow-y: auto;
    }

    .chat-send {
        width: 75px;
        height: 35px;
        color: white;
        font-size: 14px;
        background-color: $main-blue;
        margin: 0 10px;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 10px;
        transition: background-color .2s ease-in;
        position: absolute;
        bottom: 0;
        right: 0;

        &:hover {
            background-color: color.scale($main-blue, $lightness: 20%);
        }
    }
</style>