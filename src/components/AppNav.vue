<template>
    <header class="header-wrapper" :class="{'menu-open': open}">
        <div class="chat-header__left-menu" v-if="!hide">
            <button class="chat-header__left-menu-btn" @click="toggleMenu">
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
            <div class="chat-header__menu-wrapper">
                <HeaderMenu></HeaderMenu>
            </div>
        </div>
        <div class="chat-header__right" v-if="!hide">
            <router-link to="login" v-if="!loggedIn">
                <button class="chat-header__login-btn">Login</button>
            </router-link>
            <div class="profile-menu" :class="{'hide': !profile}" v-else @click="toggleProfile">
                <img :src="user.avatar" alt="">
                <div class="profile-menu__list">
                    <button class="chat-header__logout-btn" @click="doLogout">Logout</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import {
        computed,
        ref,
        watch
    } from 'vue'

    import {
        useStore
    } from 'vuex'

    import {
        useRoute
    } from 'vue-router'

    import HeaderMenu from '../components/HeaderMenu.vue'

    export default {
        name: 'AppNav',
        components: {
            HeaderMenu
        },
        setup() {
            const route = useRoute()

            const store = useStore()

            const loggedIn = computed(() => !!store.state.user)

            const open = ref(false)
            const hide = ref(false)
            const profile = ref(false)

            const user = computed(() => store.state.user)

            console.log(user);

            function doLogout() {
                store.dispatch('logout')
            }

            function toggleMenu() {
                open.value = !open.value
            }

            function toggleProfile() {
                profile.value = !profile.value
            }

            watch(() => route.path, (newPath) => {
                if (newPath == '/login' || newPath == '/register') {
                    hide.value = true
                } else {
                    hide.value = false
                }
                open.value = false
            })

            return {
                user,
                loggedIn,
                open,
                hide,
                profile,
                doLogout,
                toggleMenu,
                toggleProfile
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/value.scss';

    .header-wrapper {
        z-index: 90;
        width: 100%;
        height: $header-height;
        background-image: $main-linear-gradient;
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button:focus,
        button:active {
            outline: none;
        }

        .chat-header__left-menu-btn {
            width: 1.8rem;
            height: 1.8rem;
            color: #fff;
            font-size: 28px;
            border: none;
            outline: none;
            margin-left: 1.5rem;
            background-color: transparent;
        }

        .chat-header__menu-wrapper {
            width: auto;
            height: calc(100vh - #{$header-height});
            border-right: 1px solid #CDCDCD;
            position: fixed;
            top: 4.8rem;
            left: 0;
        }

        .chat-header__right {
            margin-right: 1.5rem;

            .chat-header__login-btn,
            .chat-header__logout-btn {
                width: 4.8rem;
                height: 3rem;
                color: #fff;
                font-size: 20px;
                background-color: transparent;
                border: 1px solid #fff;
                border-radius: 0.5rem;
            }

            .profile-menu {
                width: 3rem;
                height: 3rem;

                img {
                    width: 100%;
                    border-radius: 10px;
                    cursor: pointer;
                }

                .profile-menu__list {
                    padding: .2rem 1rem;
                    border: 1px solid $main-border-color;
                    border-radius: 5px;
                    background-color: white;
                    position: absolute;
                    top: calc(#{$header-height} + 10px);
                    right: 10px;

                    .chat-header__logout-btn {
                        color: inherit;
                    }
                }

                &.hide .profile-menu__list {
                    display: none;
                }
            }
        }
    }

    @media screen and (max-width: $tablet) {
        .header-wrapper {
            .chat-header__menu-wrapper {
                transform: translateX(-100%);
                transition: transform .3s;
            }

            &.menu-open .chat-header__menu-wrapper {
                transform: translateX(0px);
            }
        }
    }
</style>