// 注册页面的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法
const sendEmail = require('../dao/emailServer'); // 导入发送邮件的方法

// 1、用户注册
exports.register = (req, res) => {
  const userName = req.body.userName; // 用户名
  const userEmail = req.body.userEmail; // 邮箱
  const password = req.body.password; // 密码

  // 发送邮件
  sendEmail.emailSignUp(userEmail, res);

  // 向数据库中创建用户
  dbserver.buildUser(userName, userEmail, password, res);
}

// 2、判断用户/邮箱是否已经存在
exports.judgeUserAndEmail = (req, res) => {
  const data = req.body.data; // 数据
  const type = req.body.type; // 类型

  // 从数据库中搜索
  dbserver.conutUserNumber(data, type, res);
}
