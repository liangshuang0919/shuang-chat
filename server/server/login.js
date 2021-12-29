// 登录页面的服务文件
const dbserver = require('../dao/dbserver'); // 导入处理数据库的方法
// const jwt = require('../dao/jwt'); // 导入 token 模块

// 1、用户登录
exports.userLogin = (req, res) => {
  // 前端传递过来的用户名/邮箱
  const data = req.body.data;
  // 前端传递过来的密码
  const password = req.body.password;

  // 调用匹配密码的方法
  dbserver.userMatch(data, password, res);
}

// // 2、匹配 token
// exports.tokenMatch = (req, res) => {
//   // 获取前端返回的 token
//   const token = req.body.token;
//   // 对 token 进行解析
//   const result = jwt.verifyToken(token);

//   res.json({
//     data: result
//   });
// }
