const dbserver = require('./dbserver'); // 导入对数据库操作的模块

// 后端处理 websocket 通信文件
module.exports = (io) => {
  const users = {}; // 关于通信的用户

  // 监听前端链接，处理前端发送的 websocket 通信
  io.on('connection', (socket) => {
    // 1、用户登录注册
    socket.on('login', id => {
      socket.name = id;
      users[id] = socket.id; // 获取用户 id
      socket.emit('login', socket.id); // 回复客户端
    });

    // 2、用户发送一对一聊天消息
    // message 是发送的消息数据；fromId 是来自哪个用户发送的 ID，toId 是将要发送到的用户 ID
    socket.on('friendmsg', (message, fromId, toId) => {
      // 进行数据库的交互：第一个是更新好友表的最后通讯时间；第二个是更新一对一消息表
      // 修改好友最后通讯时间
      dbserver.friendMsgLastTime({
        uid: fromId,
        fid: toId
      });
      // 修改一对一消息表
      dbserver.buildFriendMsg(fromId, toId, message.message, message.types);

      // 接收到数据之后，将消息发送给对方
      if (users[toId]) {
        // 如果当前用户存在（即登录的话）那么就会发送
        // 0 表示给好友发送的消息
        socket.to(users[toId]).emit('friendmsg', message, fromId, 0);
      } else {
        // 如果用户没有登录的话，就将数据存在数据库中即可
      }

      // 1 表示发送给自己
      socket.emit('friendmsg', message, toId, 1);
    });

    // 、用户离开聊天室
    socket.on('disconnecting', () => {
      // hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性
      // 如果聊天室有该用户
      if (users.hasOwnProperty(socket.name)) {
        // 用户离开的时候，删除该用户
        delete users[socket.name];
      }
    });
  });
}
