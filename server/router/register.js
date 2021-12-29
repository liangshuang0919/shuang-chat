// 注册页面路由文件
const register = require('../server/register'); // 导入注册功能的服务

module.exports = (app) => {
  // 1、注册用户名
  app.post('/register/add', (req, res) => {
    // 调用注册用户名服务
    register.register(req, res);
  });

  // 2、判断用户/邮箱是否已经存在
  app.post('/register/judge', (req, res) => {
    // 调用判断用户/邮箱是否已经存在服务
    register.judgeUserAndEmail(req, res);
  });
}
