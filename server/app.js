const express = require('express');
const app = express();
const server = require('http').Server(app);
const startSocket = require('./socket');
const chalk = require('chalk');
const userRouter = require('./routes/user.route');
const chatRouter = require('./routes/chat.route');

const pre = +new Date()
console.log(chalk.bgBlue.black(' INFO '), 'Starting server...')

app.use(express.json());
app.use('/user', userRouter);
app.use('/chat', chatRouter);

startSocket(server);

server.listen(3000, () => {
    const now = +new Date()
    console.log('')
    console.log(chalk.bgGreen.black(' DONE '), chalk.green(`Server started successfully in ${now - pre}ms`));
});