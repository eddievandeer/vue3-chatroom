<template>
    <div class="header-menu">
        <section class="layout-minibar">
            <div class="menu-bar">
                <button class="item" :class="{'active': show == 0}" @click="handleToggle(0)">
                    <div class="unread-count" v-if="showCount">
                        {{unread.length}}
                    </div>
                    <i class="fa fa-comment-o" aria-hidden="true"></i>
                </button>
                <button class="item" :class="{'active': show == 1}" @click="handleToggle(1)">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </button>
                <button class="item" :class="{'active': show == 2}" @click="handleToggle(2)">
                    <div class="unread-count" v-if="buddyNum > 0">
                        {{buddyNum}}
                    </div>
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                </button>
                <button class="item" :class="{'active': show == 3}" @click="handleToggle(3)">
                    <i class="fa fa-cogs" aria-hidden="true"></i>
                </button>
            </div>
        </section>
        <section class="layout-main-menu scroller">
            <div class="menu-item">
                <keep-alive>
                    <component :is="curComponent">
                        <h2>{{curComponent}}</h2>
                    </component>
                </keep-alive>
            </div>
        </section>
    </div>
</template>

<script>
    import {
        computed,
        ref
    } from 'vue'
    import {
        useStore
    } from 'vuex'

    import Conversations from './scroller/Conversations.vue'
    import Search from './scroller/Search.vue'
    import People from './scroller/People.vue'
    import Setting from './scroller/Setting.vue'

    export default {
        name: 'HeaderMenu',
        components: {
            Conversations,
            Search,
            People,
            Setting
        },
        setup() {
            const store = useStore()

            const show = ref(0)

            const components = ['conversations', 'search', 'people', 'setting']

            const curComponent = computed(() => components[show.value])

            const buddyNum = computed(() => {
                let count = 0

                store.state.newBuddy.forEach(buddy => {
                    if(buddy.rejected == undefined && buddy.accepted == undefined) count++
                })

                return count
            })

            const unread = computed(() => {
                const arr = []

                const keys = Object.keys(store.state.unread)

                if (keys.length > 0) {
                    keys.forEach((key) => {
                        arr.push(...store.state.unread[key])
                    })

                    return arr
                }
                return
            })

            const showCount = computed(() => unread.value != undefined && show.value !== 0)

            function handleToggle(index) {
                show.value = index
            }

            return {
                show,
                curComponent,
                unread,
                showCount,
                buddyNum,
                handleToggle
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/value.scss';

    .header-menu {
        width: $menu-width;
        height: 100%;
        background-color: white;
        display: flex;

        .layout-minibar {
            width: 4.6rem;
            height: 100%;

            .menu-bar {
                height: 100%;
                background-color: #FDFDFD;
                border-right: 1px solid #CDCDCD;
                display: flex;
                flex-direction: column;

                .item {
                    height: 4rem;
                    font-size: 24px;
                    color: #C3C3C4;
                    border: none;
                    outline: none;
                    box-sizing: border-box;
                    background-color: transparent;
                    border-left: 4px solid transparent;
                    transition: all .3s;
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
                        top: 12px;
                        right: 12px;
                    }

                    &:hover,
                    &.active {
                        color: $icon-hover-color;
                        border-left-color: $icon-hover-color;
                    }
                }
            }
        }

        .layout-main-menu {
            flex: 1;

            .menu-item {
                height: 100%;

                h2 {
                    color: #a2a3a3;
                    line-height: 65px;
                    box-sizing: border-box;
                    text-align: left;
                    margin: 0;
                    font-weight: 400;
                    font-size: 18px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
                    padding: 0 0 0 2rem;
                }
            }
        }
    }

    @media screen and (max-width: $tablet) {
        .header-menu {
            width: 100vw;
        }
    }
</style>