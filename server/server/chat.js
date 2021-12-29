// 聊天页面的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法

// 1、分页获取一对一聊天数据
exports.getFriendMsgPage = (req, res) => {
  const data = req.body;
  dbserver.getFriendMsgPage(data, res);
}
