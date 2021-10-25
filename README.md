# vue3-chatroom
一个使用 vue3 + express + socket.io 开发的网页版在线聊天应用，支持好友功能、表情功能及视频聊天功能

## 安装依赖
~~~bash
npm install
# OR yarn add
~~~



## 启动后端服务

启动前需要先创建一个数据库，并使用根目录下的 `db.sql` 文件创建项目所需的表，然后将数据库的相关配置写在根目录下的 `mysql/index.js` 下，配置选项参考如下内容：

~~~js
module.exports = {
    host: 'localhost',  // 主机地址
    port: '3306',		// 该项非必选，可不进行配置，默认为3306
    user: 'xxx',        // 用户名
    password: 'xxx',    // 密码
    database: 'test'    // 数据库名
}
~~~

创建完数据库后还需在 `config` 文件夹下的 `ws.js` 中配置如下信息：
~~~js
module.exports = {
    origin: 'http://192.168.1.10:8080',	// 后端用，处理跨域
    target: 'http://192.168.1.10:3000'	// 前端用，向后端发送请求的url
}
~~~
最后运行如下命令启动后端项目
~~~bash
npm run server
# OR yarn server
~~~



## 启动前端服务

~~~bash
npm run dev
# OR yarn dev
~~~



## 打包项目

~~~bash
npm run build
# OR yarn build
~~~
