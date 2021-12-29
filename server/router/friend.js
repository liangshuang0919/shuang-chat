// 好友路由文件
const friend = require('../server/friend'); // 导入处理好友的服务

module.exports = (app) => {
  // 1、好友申请
  app.post('/friend/apply', (req, res) => {
    // 调用好友申请服务
    friend.applyFriend(req, res);
  });

  // 2、同意好友申请
  app.post('/friend/agreeApply', (req, res) => {
    // 调用好友申请服务
    friend.agreeFriendApply(req, res);
  });

  // 3、拒绝好友申请或删除好友
  app.post('/friend/rejectOrDelete', (req, res) => {
    // 调用好友申请服务
    friend.rejectOrDeleteFriend(req, res);
  });
}
