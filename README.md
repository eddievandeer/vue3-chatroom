# vue3-chatroom
一个使用 vue3 + express + socket.io 开发的网页版在线聊天应用，支持好友功能、表情功能及视频聊天功能

## 安装依赖
```
npm install
```

### 启动后端服务
先创建一个数据库，并使用根目录下的 `db.sql` 文件创建项目所需的表，然后将数据库的相关配置写在根目录下的 `mysql/index.js` 下，配置选项参考如下内容：

```js
module.exports = {
    host: 'localhost',  // 主机地址
    user: 'xxx',        // 用户名
    password: 'xxx',    // 密码
    database: 'test'    // 数据库名
}
```

```
npm run server
```

### 启动前端服务
```
npm run dev
```

### 打包项目
```
npm run build
```
