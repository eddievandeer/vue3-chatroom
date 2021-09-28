const { addMessage, addBuddy } = require('../db');

const socketPool = new Map(),
    messageQueue = new Map(),
    buddyQueue = new Map;

function startSocket(server) {
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://10.6.201.6:8080",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on('connection', function (socket) {
        console.log('an user connected');

        let uid

        // 监听断开连接状态：socket的disconnect事件表示客户端与服务端断开连接
        socket.on('disconnect', () => {
            socketPool.delete(uid)
            socket.disconnect();
            console.log('connect disconnect');
            console.log(socketPool);
        });

        // 当用户连接时，发送未接收消息及未接收的好友请求
        socket.on('user connect', (data) => {
            uid = data.uid
            socketPool.set(data.uid, socket.id)
            socket.broadcast.emit('online status', {
                uid: data.uid,
                status: socketPool.has(data.uid)
            });

            if (messageQueue.has(uid)) {
                console.log('发送未接收的消息 -> ' + socket.id, messageQueue.get(uid));

                io.to(`${socket.id}`).emit('new server message', messageQueue.get(uid))
                messageQueue.delete(uid)
            }

            // 未接收的好友请求
            if (buddyQueue.has(uid)) {
                io.to(`${socket.id}`).emit('check buddy', buddyQueue.get(uid))
            }
        })

        // 向对应的用户发送消息
        socket.on('client message', (data) => {
            addMessage(data.message, data.from, data.to)
                .then((response) => console.log(response))

            console.log(data.to, socketPool);
            if (socketPool.has(data.to)) {
                // 当前连接池中有目标用户，发送消息
                const toId = socketPool.get(data.to)

                io.to(`${toId}`).emit('server message', data)
                io.to(`${toId}`).emit('new server message', data)
                console.log('post to ' + data.to);
            } else {
                // 目标用户不在线，存入消息队列
                if (!messageQueue.has(data.to)) {
                    messageQueue.set(data.to, [data])
                } else {
                    messageQueue.get(data.to).push(data)
                }
            }
        });

        // 接收好友请求，目标在线发送校验信息，不在线则存入好友请求队列
        socket.on('add buddy', (data) => {
            if (socketPool.has(data.to)) {
                const toId = socketPool.get(data.to)

                io.to(`${toId}`).emit('check buddy', data)
                console.log('make friend with  ' + data.to);
            } else {
                buddyQueue.set(data.to, data.from)
            }
        });

        // 接收用户校验结果，同意好友请求存入数据库，不同意忽略
        socket.on('check buddy', (data) => {
            buddyQueue.delete(data.from)

            if (data.check == true) {
                const fromId = socketPool.get(data.from)

                io.to(`${fromId}`).emit('add buddy')
                addBuddy(data.from, data.to)
            }
        });

        // 检测好友在线状态
        socket.on('check online status', (data) => {
            const status = data.map(fid => socketPool.has(fid))

            socket.emit('online status', status)
        })
        // socket.disconnect();

        // 邀请用户
        socket.on("inviteVideo", (data) => {
            let { from, to } = data;
            let msg = from + '邀请你进行视频通话';

            io.to(`${socketPool.get(to)}`).emit('inviteVideoHandler', {
                from,
                to,
                msg
            });
        });

        // 回应用户是否邀请成功
        socket.on("askVideo", (data) => {
            console.log(data);
            let { from, to, allow } = data;
            let msg;

            if (allow == 1) {
                msg = "接受了你的邀请"
            } else {
                msg = '拒绝了你的邀请'
            }

            io.to(`${socketPool.get(from)}`).emit('askVideoHandler', {
                allow,
                msg
            });
        });

        // 用户发送ice到服务端，服务端转发给另一个用户
        socket.on("_ice", (data) => {
            let target = data.to
            console.log("_ice", data.to);

            if (socket.id == socketPool.get(target)) {
                target = data.from
            }

            io.to(`${socketPool.get(target)}`).emit("ice", data.streamData);
        });

        // 用户发送offer到服务端，服务端转发给另一个用户
        socket.on("_offer", (data) => {
            let target = data.to
            console.log("_offer", data.to, data.from);

            if (socket.id == socketPool.get(target)) {
                target = data.from
            }

            io.to(`${socketPool.get(target)}`).emit("offer", data.streamData);
        });

        // 用户发送answer到服务端，服务端转发给另一个用户
        socket.on("_answer", (data) => {
            let target = data.to
            console.log("_answer", data.to);

            if (socket.id == socketPool.get(target)) {
                target = data.from
            }

            io.to(`${socketPool.get(target)}`).emit("answer", data.streamData);
        });
        socket.on("_break", (data) => {
            //挂断聊天
            console.log("_break", data.to);

            io.to(`${socketPool.get(data.to)}`).emit("break", {
                msg: "聊天挂断",
            });
            io.to(`${socketPool.get(data.from)}`).emit("break", {
                msg: "聊天挂断",
            });
        });
    });
}

module.exports = startSocket