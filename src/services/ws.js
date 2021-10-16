import { io } from 'socket.io-client'
import wsConfig from '../../config/ws'

class Socket {
    constructor(uid) {
        this.uid = uid

        this.handler = (data) => {
            console.log(data);
        }

        this.initSocket()
    }

    initSocket() {
        if (Socket.socket == undefined || Socket.socket == null) {
            Socket.socket = io(wsConfig.target, {
                withCredentials: true,
            })

            Socket.socket.on('connect', () => {
                console.log(Socket.socket.id) // x8WIv7-mJelg7on_ALbx
            })

            // Socket.socket.on('server message', (data) => {
            //     console.log(data)
            // })

            Socket.socket.emit('user connect', { uid: this.uid })
        }

        this.socket = Socket.socket
    }

    postMsg(to, nickname, message, avatar) {
        this.socket.emit('client message', {
            from: this.uid,
            to,
            nickname,
            message,
            avatar,
            send_time: new Date().toLocaleString()
        })
    }

    addHandler(eventType, handler) {
        this.handler = handler

        this.socket.on(eventType, this.handler)
    }

    newBuddy(buddy) {
        this.socket.emit('add buddy', buddy)
    }

    checkBuddy(check) {
        this.socket.emit('check buddy', check)
    }

    checkOnlineStatus(fids) {
        this.socket.emit('check online status', fids)
    }

    initVideo(videoCall, handleAccept, handleHangUp) {
        // 被邀请视频
        this.socket.on('inviteVideoHandler', (data) => {
            console.log(data);
            let { from, to, msg } = data
            let allow = 0

            let res = confirm(msg);
            if (res) {
                allow = 1
                videoCall.startVideoStream() //用户点击同意后开始初始化视频聊天
                handleAccept()
            }

            this.askVideo(from, to, allow)
        });

        // 视频邀请结果
        this.socket.on('askVideoHandler', (data) => {
            console.log(data);
            if (data.allow == -1) return //通话中
            if (data.allow) {
                videoCall.startVideoStream()
            }
        });

        this.socket.on('ice', videoCall.getIce.bind(videoCall)); //从服务端接收ice
        this.socket.on('offer', videoCall.getOffer.bind(videoCall)); //从服务端接收offer
        this.socket.on('answer', videoCall.getAnswer.bind(videoCall)); //从服务端接收answer
        this.socket.on('break', (data) => {
            console.log(data);
            videoCall.stopVideoStream(data)
            handleHangUp()
        }) //挂断视频通话
    }

    startVideo(from, to) {
        console.log(from, to);
        this.socket.emit('inviteVideo', {
            from,
            to
        })
    }

    stopVideo(from, to) {
        this.socket.emit('_break', {
            from,
            to
        })
    }

    askVideo(from, to, allow) {
        this.socket.emit('askVideo', {
            from,
            to,
            allow
        })
    }

    sendOffer(offer) {
        this.socket.emit('_offer', offer)
    }

    sendAnswer(answer) {
        this.socket.emit('_answer', answer)
    }

    sendIce(ice) {
        console.log(this, ice);
        this.socket.emit('_ice', ice)
    }
}

export default Socket