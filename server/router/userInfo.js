// 用户详情页面路由文件
const userInfo = require('../server/userInfo'); // 导入用户详情功能的服务

module.exports = (app) => {
  // 1、用户详情
  app.post('/user/info', (req, res) => {
    // 调用注册用户名服务
    userInfo.userInfo(req, res);
  });

  // 2、修改用户数据
  app.post('/user/update', (req, res) => {
    // 调用注册用户名服务
    userInfo.userUpdate(req, res);
  });

  // 3、获取好友昵称
  app.post('/friend/getNickName', (req, res) => {
    // 调用注册用户名服务
    userInfo.getFriendNickName(req, res);
  });

  // 4、修改好友昵称
  app.post('/friend/updateNickName', (req, res) => {
    // 调用注册用户名服务
    userInfo.updateFriendNickName(req, res);
  });
}
