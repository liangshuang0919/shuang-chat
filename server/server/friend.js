// 好友页面的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法

// 1、好友申请接口
exports.applyFriend = (req, res) => {
  const data = req.body;
  dbserver.applyFriend(data, res);
}

// 2、同意好友申请
exports.agreeFriendApply = (req, res) => {
  const data = req.body;
  dbserver.agreeFriendApply(data, res);
}

// 3、拒绝好友申请或删除好友
exports.rejectOrDeleteFriend = (req, res) => {
  const data = req.body;
  dbserver.rejectOrDeleteFriend(data, res);
}
