// 首页用户列表的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法

// 1、首页用户列表
exports.getUserList = (req, res) => {
  const data = req.body;
  dbserver.getUserList(data, res);
}

// 2、获取一对一通讯的最后一条消息
exports.getFriendMsg = (req, res) => {
  const data = req.body;
  dbserver.getFriendMsg(data, res);
}

// 3、获取一对一通讯未读消息数
exports.getFriendUnreadMsgNum = (req, res) => {
  const data = req.body;
  dbserver.getFriendUnreadMsgNum(data, res);
}

// 4、修改一对一通讯状态为已读
exports.updateFriendMsgState = (req, res) => {
  const data = req.body;
  dbserver.updateFriendMsgState(data, res);
}

// 5、获取群列表
exports.getGrouprList = (req, res) => {
  const uid = req.body.uid;
  dbserver.getGrouprList(uid, res);
}

// 6、按要求获取最后一条群消息
exports.getGroupMsg = (req, res) => {
  const gid = req.body.gid;
  dbserver.getGroupMsg(gid, res);
}

// 7、当群消息被读取后，将对应用户的消息状态置为已读，0
exports.updateGroupMsgState = (req, res) => {
  const data = req.body;
  dbserver.updateGroupMsgState(data, res);
}
