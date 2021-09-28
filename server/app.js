const express = require('express');
const app = express();
const server = require('http').Server(app);
const startSocket = require('./socket');
const userRouter = require('./routes/user.route');
const chatRouter = require('./routes/chat.route');

app.use(express.json());
app.use('/user', userRouter);
app.use('/chat', chatRouter);

startSocket(server);

server.listen(3000, () => {
    console.log('server started');
});