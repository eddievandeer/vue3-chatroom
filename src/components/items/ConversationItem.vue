<template>
    <router-link :to="`/chat/${uid}`">
        <div class="conversation-item" @click="handleRead">
            <div class="user-avatar">
                <div class="unread-count" v-if="showCount">
                    {{unread.length}}
                </div>
                <img :src="conversation.avatar" alt="">
            </div>
            <div class="user-info">
                <div class="user-name">
                    {{conversation.nickname}}
                </div>
                <div class="last-message">
                    {{last}}
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
    import {
        computed
    } from '@vue/runtime-core'
    import {
        useStore
    } from 'vuex'

    export default {
        props: ['conversation', 'uid'],
        setup(props) {
            const store = useStore()

            const lastMessage = store.state.lastMessage

            const unread = computed(() => store.state.unread[props.uid])

            const last = computed(() => lastMessage[props.uid])

            const showCount = computed(() => unread.value != undefined)

            function handleRead() {
                if (showCount.value) {
                    store.commit('READ_NEW_MESSAGE', props.uid)
                }
            }

            return {
                last,
                unread,
                showCount,
                handleRead
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/value.scss';

    a {
        color: inherit;
        text-decoration: none;

        &.router-link-active .conversation-item {
            background-color: #F2F2F2;
        }
    }

    .conversation-item {
        width: 100%;
        height: 4.5rem;
        padding: .6rem 1rem;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;

        .user-avatar {
            position: relative;

            .unread-count {
                width: 1rem;
                height: 1rem;
                color: white;
                font-size: 12px;
                line-height: 1rem;
                text-align: center;
                border-radius: 50%;
                background-color: red;
                position: absolute;
                top: -3px;
                right: -3px;
            }

            img {
                height: 100%;
                border: 1px solid $main-border-color;
                border-radius: 10px;
                background-color: #eee;
                box-sizing: border-box;
            }
        }

        .user-info {
            padding-top: .2rem;
            padding-left: 1rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .last-message {
                width: $item-width;
                color: #868686;
                font-size: 14px;
                margin-top: .2rem;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        &:hover {
            background-color: #F2F2F2;
        }
    }

    @media screen and (max-width: $tablet) {
        .conversation-item .user-info .last-message {
            width: $item-width-m;
        }
    }

    @media screen and (max-width: $mobile) {
        .conversation-item .user-info .last-message {
            width: $item-width-s;
        }
    }
</style>