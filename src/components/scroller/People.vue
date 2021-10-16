<template>
    <div class="people-container">
        <slot></slot>
        <div class="new-buddy" v-if="newBuddy.length > 0">
            <p class="new-buddy-title">好友通知</p>
            <div v-for="(buddy, index1) in newBuddy" :key="index1" class="buddy-item">
                <div class="user-avatar">
                    <img :src="buddy.avatar" alt="">
                </div>
                <div class="user-info">
                    <div class="user-name">
                        {{buddy.username}}
                    </div>
                </div>
                <div class="new-buddy-btns">
                    <div v-if="buddy.rejected">
                        已拒绝
                    </div>
                    <div v-else-if="buddy.accepted">
                        已接受
                    </div>
                    <div v-else>
                        <button class="accept-btn" @click="handleCheck(true, index1, buddy)">同意</button>
                        <button class="reject-btn" @click="handleCheck(false, index1, buddy)">拒绝</button>
                    </div>
                </div>
            </div>
        </div>
        <p class="people-title">好友列表</p>
        <PeopleItem v-for="(friend, index) in friends" :key="index" :friend="friend"></PeopleItem>
        <div class="people-empty" v-if="friends.length < 1">
            暂无好友，可搜索添加
        </div>
    </div>
</template>

<script>
    import {
        computed,
        onMounted
    } from '@vue/runtime-core'
    import {
        useStore
    } from 'vuex'

    import PeopleItem from '../items/PeopleItem.vue'
    import Socket from '@/services/ws'

    export default {
        components: {
            PeopleItem
        },
        setup() {
            const store = useStore()

            const friends = computed(() => store.state.friends)

            const socket = new Socket(store.state.user.uid)

            const newBuddy = computed(() => store.state.newBuddy)

            function handleCheck(check, index, buddy) {
                if (check) {
                    socket.checkBuddy({
                        from: buddy.from,
                        to: buddy.to,
                        check
                    })

                    setTimeout(() => {
                        store.dispatch('friendList')
                    }, 500);
                }

                store.commit('RESOLVE_BUDDY', {
                    index,
                    check
                })
            }

            onMounted(() => {
                const fids = store.state.friends.map(friend => friend.friend_id)

                socket.checkOnlineStatus(fids)
            })

            return {
                friends,
                newBuddy,
                handleCheck
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/value.scss';

    .people-container {
        height: 100%;
        position: relative;
    }

    .people-empty {
        width: fit-content;
        font-size: 20px;
        color: #8a8a8a;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .new-buddy {
        margin-bottom: .4rem;
    }

    .new-buddy-title,
    .people-title {
        width: 100%;
        color: #8a8a8a;
        font-size: 14px;
        text-align: left;
        padding: 0 0 .2rem 1rem;
        margin: 0;
    }

    .buddy-item {
        width: 100%;
        height: 4.5rem;
        padding: .6rem 1rem;
        box-sizing: border-box;
        position: relative;
        display: flex;
        justify-content: flex-start;

        .user-avatar img {
            height: 100%;
            border: 1px solid $main-border-color;
            border-radius: 10px;
            background-color: #eee;
            box-sizing: border-box;
        }

        .user-info {
            padding-left: 1rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        .new-buddy-btns {
            font-size: 14px;
            position: absolute;
            top: 30%;
            right: 10px;

            .accept-btn,
            .reject-btn {
                padding: .3rem .8rem;
                border: none;
                outline: none;
                border-radius: 5px;
                margin: 0 .2rem;
            }

            .accept-btn {
                color: white;
                background-color: $main-blue;
            }

            .reject-btn {
                border: 1px solid $main-border-color;
                background-color: white;
            }
        }

        &:hover {
            background-color: #F2F2F2;
        }
    }
</style>