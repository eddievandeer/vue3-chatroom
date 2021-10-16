<template>
    <div class="video-wrapper" v-show="showVideo">
        <div class="video-mask"></div>
        <div class="video-main">
            <button class="close-btn" @click="closeVideo"><i class="fa fa-times" aria-hidden="true"></i></button>
            <video id="video" src="" class="self-video chat-video"></video>
            <video id="otherVideo" src="" class="other-video chat-video"></video>
            <div class="video-btns">
                <button class="hang-up" v-if="isCalling" @click="hangUp">挂断</button>
                <button class="initiate" v-else @click="invite">发起</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        computed,
        onMounted,
        ref
    } from 'vue'
    import {
        useStore
    } from 'vuex'
    import {
        useRoute
    } from 'vue-router'

    import VideoCall from './video'
    import Socket from '@/services/ws'

    export default {
        setup() {
            const store = useStore()

            const route = useRoute()

            const showVideo = computed(() => store.state.calling)

            const isCalling = ref(false)

            let videoCall, socket

            onMounted(() => {
                socket = new Socket(store.state.user.uid)
                videoCall = new VideoCall(socket, store.state.user.uid, parseInt(route.params.uid))

                socket.initVideo(videoCall, () => {
                    isCalling.value = true
                    console.log('accept');
                    store.commit('CALL_VIDEO_CHAT')
                }, () => {
                    isCalling.value = false
                    console.log('reject');
                    store.commit('HANG_UP_VIDEO_CHAT')
                })
            })

            function invite() {
                isCalling.value = true
                console.log(store.state.user.uid, parseInt(route.params.uid));
                socket.startVideo(store.state.user.uid, parseInt(route.params.uid))
            }

            function hangUp() {
                socket.stopVideo(store.state.user.uid, parseInt(route.params.uid))
            }

            function closeVideo() {
                store.commit('HANG_UP_VIDEO_CHAT')
            }

            return {
                showVideo,
                isCalling,
                invite,
                hangUp,
                closeVideo
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../style/value.scss';

    .video-wrapper {
        width: 100%;
        height: 100%;
        display: flex;

        .video-mask {
            width: 100%;
            height: 100%;
            background-color: rgba($color: #000000, $alpha: .3);
            position: absolute;
            top: 0;
            left: 0;
        }

        .video-main {
            z-index: 50;
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;

            .close-btn {
                z-index: 60;
                color: white;
                font-size: 24px;
                border: none;
                outline: none;
                background-color: transparent;
                position: absolute;
                top: 1rem;
                right: 1rem;
            }

            .self-video {
                width: 200px;
                position: absolute;
                top: 0;
                right: 0;
            }

            .other-video {
                width: 100%;
                height: 80%;
            }

            .video-btns {
                height: 20%;
                display: flex;
                justify-content: center;
                align-items: center;

                .initiate {
                    color: white;
                    padding: .8rem 1.8rem;
                    border: none;
                    border-radius: 10px;
                    background-color: $main-blue;
                }

                .hang-up {
                    color: white;
                    padding: .8rem 1.8rem;
                    border: none;
                    border-radius: 10px;
                    background-color: red;
                }
            }
        }
    }
</style>