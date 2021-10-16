let stream
let peer

class VideoCall {
    constructor(socket, from, to) {
        this.socket = socket
        this.from = from
        this.to = to
    }

    startVideoStream(e) {
        this.createMedia()
    }

    stopVideoStream(data) {
        console.log(data.msg);

        stream.getTracks().forEach(async track => {
            await track.stop()
            await stream.removeTrack(track)
            stream = null
        })

        VideoCall.isCalling = false
        peer.close()
        peer = null
    }

    // 同步创建本地媒体流
    async createMedia() {
        if (!stream) {
            console.log(navigator.mediaDevices);
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            })
        }

        const video = document.querySelector('#video')

        // 将媒体流输出到本地video以显示
        video.srcObject = stream

        video.onloadedmetadata = (e) => {
            video.play()
        }

        this.createPeerConnection()
    }

    // 同步初始化描述文件并添加事件
    async createPeerConnection() {
        if (!peer) {
            peer = new RTCPeerConnection()
        }

        await stream.getTracks().forEach(async track => {
            // 将本地流附属至peer中
            await peer.addTrack(track, stream)
        })

        // 当peer收到其他流时显示另一个video以显示对方
        peer.addEventListener('addstream', this.setVideo.bind(this))
        // 获取到candidate时，将其发送至服务端，传至对方
        peer.addEventListener('icecandidate', this.sendIce.bind(this))
        // 双方约定的协商被完成时才触发该方法
        peer.addEventListener('negotiationneeded', this.sendOffer.bind(this))
    }

    // 播放对方的视频流
    setVideo(event) {
        const otherVideo = document.querySelector('#otherVideo')

        VideoCall.isCalling = true

        otherVideo.srcObject = event.stream
        otherVideo.onloadedmetadata = function(e) {
            otherVideo.play()
        }
    }

    // 同步发送offer到服务端，发送给对方
    async sendOffer() {
        let offer = await peer.createOffer()

        await peer.setLocalDescription(offer)

        this.socket.sendOffer({
            streamData: offer,
            from: this.from,
            to: this.to
        })
    }

    // 接收到offer后，返回answer给对方
    async getOffer(data) {
        console.log(data);
        if (!peer) return

        await peer.setRemoteDescription(data)
        this.sendAnswer()
    }

    async sendAnswer() {
        let answer = await peer.createAnswer()

        await peer.setLocalDescription(answer)
        this.socket.sendAnswer({
            streamData: answer,
            from: this.from,
            to: this.to
        })
    }

    async getAnswer(data) {
        console.log(data);
        await peer.setRemoteDescription(data)
    }

    sendIce(e) {
        if (!e || !e.candidate) return

        this.socket.sendIce({
            streamData: e.candidate,
            from: this.from,
            to: this.to
        })
    }

    async getIce(data) {
        if (!peer) return

        let candidate = new RTCIceCandidate(data)
        await peer.addIceCandidate(candidate)
    }
}

export default VideoCall