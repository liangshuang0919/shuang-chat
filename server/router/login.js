// 登录页面路由文件
const login = require('../server/login'); // 导入登录功能的服务

module.exports = (app) => {
  // 1、用户登录
  app.post('/login', (req, res) => {
    // 调用用户登录服务
    login.userLogin(req, res);
  });

  // 2、匹配 token 是否一致
  app.post('/login/tokenMatch', (req, res) => {
    res.status(200).json({ status: 200, message: 'token 正确，通过校验' });
  })
}
