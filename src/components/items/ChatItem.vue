<template>
    <div class="chat-item" :class="{'self': message.from_uid == uid}">
        <div class="chat-avatar">
            <img :src="message.avatar" alt="">
        </div>
        <div class="message-container">
            <div class="send-time">
                {{message.send_time}}
            </div>
            <div class="message" v-html="decoded"></div>
        </div>
    </div>
</template>

<script>
    import {
        ref
    } from 'vue'
    import {
        useStore
    } from 'vuex'

    import emojiMaps from '@/config/emoji'

    export default {
        props: ['message'],
        setup(props) {
            const store = useStore()

            const uid = store.state.user.uid

            const decoded = ref('')

            const source = props.message.message

            decoded.value = source.replace(/_\[(.+?)\]/g, (match, p1) => {
                return `<img src="${emojiMaps[p1]}" title="${match}" class="emoji-pic">`
            })

            return {
                uid,
                decoded
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/value.scss';

    $vertical-padding: .6rem;
    $horizontal-padding: 1.2rem;
    $image-width: 2.6rem;

    .chat-item {
        width: 100%;
        padding: $vertical-padding $horizontal-padding;
        box-sizing: border-box;
        position: relative;
        display: flex;
        justify-content: flex-start;

        .chat-avatar img {
            width: $image-width;
            border: 1px solid $main-border-color;
            border-radius: 10px;
            background-color: #eee;
            box-sizing: border-box;
        }

        .message-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .send-time {
            font-size: 14px;
            color: #aaa;
            margin: 0 1rem;
            padding-bottom: 3px;
            text-align: left;
        }

        .message {
            width: fit-content;
            max-width: 350px;
            min-height: 40px;
            font-size: 18px;
            line-height: 30px;
            text-align: left;
            padding: 5px 12px 5px 12px;
            margin: 0 1rem;
            box-sizing: border-box;
            border-radius: 6px;
            border-color: white;
            background-color: white;
            word-break: break-all;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            &::after {
                content: " ";
                width: 0;
                height: 0;
                border-style: solid;
                border-color: transparent;
                border-top-color: inherit;
                border-width: 8px;
                position: absolute;
                top: 0;
                left: -5px;
            }
        }

        &.self {
            justify-content: flex-end;

            .chat-avatar {
                position: absolute;
                right: $horizontal-padding;
            }

            .message-container {
                padding-right: $image-width;
                align-items: flex-end;

                .send-time {
                    text-align: right;
                }

                .message {
                    color: #fff;
                    background-color: $main-blue;
                    border-color: $main-blue;

                    span {
                        height: 100%;
                    }

                    &::after {
                        left: unset;
                        right: -5px;
                    }
                }
            }
        }
    }
</style>