// 首页用户列表页面路由文件
const userList = require('../server/userList'); // 导入首页用户列表的服务

module.exports = (app) => {
  // 1、获取首页用户列表
  app.post('/user/getUserList', (req, res) => {
    userList.getUserList(req, res);
  });

  // 2、获取一对一通讯的最后一条消息
  app.post('/user/getFriendMsg', (req, res) => {
    userList.getFriendMsg(req, res);
  });

  // 3、获取一对一通讯未读消息数
  app.post('/user/getFriendUnreadMsgNum', (req, res) => {
    userList.getFriendUnreadMsgNum(req, res);
  });

  // 4、修改一对一通讯状态为已读
  app.post('/user/updateFriendMsgState', (req, res) => {
    userList.updateFriendMsgState(req, res);
  });

  // 5、获取群列表
  app.post('/user/getGrouprList', (req, res) => {
    userList.getGrouprList(req, res);
  });

  // 6、按要求获取最后一条群消息
  app.post('/user/getGroupMsg', (req, res) => {
    userList.getGroupMsg(req, res);
  });

  // 7、当群消息被读取后，将对应用户的消息状态置为已读，0
  app.post('/user/updateGroupMsgState', (req, res) => {
    userList.updateGroupMsgState(req, res);
  });
}
