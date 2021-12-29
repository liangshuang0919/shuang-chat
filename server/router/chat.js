// 聊天页面路由文件
const chat = require('../server/chat'); // 导入处理好友的服务

module.exports = (app) => {
  // 1、分页获取聊天数据
  app.post('/chat/getFriendMsgPage', (req, res) => {
    // 调用聊天服务
    chat.getFriendMsgPage(req, res);
  });
}
