<template>
    <div class="conversations-container">
        <slot></slot>
        <div v-for="(conversation, index) in conversations" :key="index">
            <ConversationItem :conversation="conversation" :uid="conversation.uid"></ConversationItem>
        </div>
        <div class="conversations-empty" v-if="conversations.length < 1">
            聊天列表为空
        </div>
    </div>
</template>

<script>
    import {
        useStore
    } from 'vuex'

    import ConversationItem from '../items/ConversationItem.vue'

    export default {
        components: {
            ConversationItem
        },
        setup() {
            const store = useStore()

            const conversations = store.state.conversations

            return {
                conversations
            }
        }
    }
</script>

<style>
    .conversations-container {
        height: 100%;
        position: relative;
    }

    .conversations-empty {
        width: fit-content;
        font-size: 20px;
        color: #8a8a8a;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>