// 用户详情的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法

// 1、用户详情
exports.userInfo = (req, res) => {
  const id = req.body.id;
  dbserver.userInfo(id, res);
}

// 2、修改用户数据
exports.userUpdate = (req, res) => {
  const data = req.body;
  dbserver.userUpdate(data, res);
}

// 3、获取好友昵称
exports.getFriendNickName = (req, res) => {
  const nickName = req.body;
  dbserver.getFriendNickName(nickName, res);
}

// 4、修改好友昵称
exports.updateFriendNickName = (req, res) => {
  const nickName = req.body;
  dbserver.updateFriendNickName(nickName, res);
}
