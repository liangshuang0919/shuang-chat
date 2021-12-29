// 路由文件
const dbserver = require('../dao/dbserver'); // 导入数据库处理文件
const emailServer = require('../dao/emailServer'); // 导入发送邮件服务

module.exports = (app) => {
  // test 页面
  app.get('/test', (req, res) => {
    // res.send('测试接口');
    dbserver.findUser(res); // 查找用户表的数据
  });

  // 邮箱测试
  app.post('/mail', (req, res) => {
    const mail = req.body.mail; // 获取前端传递的邮箱号
    emailServer.emailSignUp(mail, res); // 调用发送邮箱事件
  });
}
