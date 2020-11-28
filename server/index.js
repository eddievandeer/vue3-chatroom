const express = require('express');
const app = express();
const server = require('http').Server(app);
const jwt = require('jsonwebtoken');
const { login } = require('./db');

app.use(express.json())

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

app.post('/login', (req, res) => {
    const userDB = login(req.body.username, req.body.password);
    userDB.then((result) => {
        console.log(result);
        if (result) {
            res.status(400).json({ error: 'Username or password is wrong!' })
        }
        else {
            const token = jwt.sign({ result }, 'the_secret_key')
            // In a production app, you'll want the secret key to be an environment variable
            res.json({
                uid: result.user_id,
                token
            })
        }
    }).catch(() => {
        res.status(400).json({ error: 'Username or password is wrong!' })
    });
})

app.get('/dashboard', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the_secret_key', err => {
        if (err) {
            res.sendStatus(401)
        } else {
            res.json({
                events: 'events'
            })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(401)
    }
}

server.listen(3000, '127.0.0.1', () => {
    console.log('server started');
});