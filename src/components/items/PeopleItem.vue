<template>
    <router-link :to="`/profile/${friend.friend_id || friend.user_id}`">
        <div class="friend-item">
            <div class="user-avatar" :style="friend.online == true ? '' : 'filter: grayscale(100%);'">
                <img :src="friend.avatar" alt="">
            </div>
            <div class="user-info">
                <div class="user-name">
                    {{friend.nickname}}
                </div>
                <div class="user-signature">
                    <span v-if="friend.online == true">
                        [
                        <i class="fa fa-circle" aria-hidden="true" style="color: #22A588"></i>
                        在线] 
                    </span>
                    <span v-else>[离线] </span>
                    {{friend.signature}}
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
    export default {
        props: ['friend']
    }
</script>

<style lang="scss" scoped>
    @import '../../style/value.scss';

    a {
        color: inherit;
        text-decoration: none;

        &.router-link-active .friend-item {
            background-color: #F2F2F2;
        }
    }

    .friend-item {
        width: 100%;
        height: 4.5rem;
        padding: .6rem 1rem;
        box-sizing: border-box;
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
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;

            .user-signature {
                width: $item-width;
                color: #868686;
                font-size: 13px;
                text-align: left;
                margin-top: .2rem;
                white-space: nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }

        &:hover {
            background-color: #F2F2F2;
        }
    }

    @media screen and (max-width: $tablet) {
        .friend-item .user-info .user-signature {
            width: $item-width-m;
        }
    }

    @media screen and (max-width: $mobile) {
        .friend-item .user-info .user-signature {
            width: $item-width-s;
        }
    }
</style>