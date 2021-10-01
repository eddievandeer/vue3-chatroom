<template>
    <AppNav></AppNav>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <router-view />
</template>

<script>
    import AppNav from './components/AppNav'
    import {
        useStore
    } from 'vuex'

    export default {
        name: 'App',
        components: {
            AppNav
        },
        setup() {
            const store = useStore()

            initStore('user', 'SET_USER_DATA')
            initStore('conversations', 'SET_CONVERSATION_DATA')
            initStore('lastMessage', 'SET_LAST_MESSAGES_DATA')
            initStore('unread', 'SET_UNREAD_DATA')

            function initStore(property, mutation) {
                let item = localStorage.getItem(property)

                if (item && item !== 'undefined') {
                    const data = JSON.parse(item)

                    store.commit(mutation, data)
                }
            }
        }
    }
</script>

<style>
    @import url('./style/global.scss');

    #app {
        min-height: 100vh;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        display: flex;
    }
</style>