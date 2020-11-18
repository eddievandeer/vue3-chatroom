var express = require('express');
var app = express();
var server = require('http').Server(app);

var { login } = require('./db');

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', function (socket) {
    console.log('an user connected');

    var test = login('root', 'root');
    test.then((result) => {
        console.log(result);
    }).catch((err) => {

    });
    // io.emit()方法用于向服务端发送消息，参数1表示自定义的数据名，参数2表示需要配合事件传入的参数
    io.emit('server message', { msg: 'client connect server success' });

    // socket.broadcast.emit()表示向除了自己以外的客户端发送消息
    socket.broadcast.emit('server message', { msg: 'broadcast' });

    // 监听断开连接状态：socket的disconnect事件表示客户端与服务端断开连接
    socket.on('disconnect', () => {
        socket.disconnect();
        console.log('connect disconnect');
    });

    // 与客户端对应的接收指定的消息
    socket.on('client message', (data) => {
        io.emit('server message', { msg: data.msg });
        console.log(data);// hi server
    });

    socket.on('submit data', (data) => {
        io.emit('chat data', {
            username: data.username,
            message: data.message
        })
    })

    // socket.disconnect();
});

server.listen(3000, '127.0.0.1', () => {
    console.log('server started');
});