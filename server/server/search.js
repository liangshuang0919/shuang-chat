// 搜索用户、群功能的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法

// 1、用户搜索
exports.searchUser = (req, res) => {
  const data = req.body.data;
  dbserver.searchUser(data, res); // 调用搜索用户的方法
}

// 2、判断是否为好友
exports.isFriend = (req, res) => {
  const uid = req.body.uid;
  const fid = req.body.fid;
  dbserver.isFriend(uid, fid, res); // 调用判断是否为好友的方法
}

// 3、搜索群
exports.searchGroup = (req, res) => {
  const data = req.body.data;
  dbserver.searchGroup(data, res); // 调用搜索群的方法
}

// 4、判断是否在群内
exports.isGroup = (req, res) => {
  const uid = req.body.uid;
  const gid = req.body.gid;
  dbserver.isGroup(uid, gid, res); // 调用判断是否在群内的方法
}
