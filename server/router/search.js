// 搜索功能路由文件
const search = require('../server/search'); // 导入搜索功能的服务

module.exports = (app) => {
  // 1、搜索用户
  app.post('/search/user', (req, res) => {
    // 调用注册用户名服务
    search.searchUser(req, res);
  });

  // 2、判断是否为好友
  app.post('/search/isfriend', (req, res) => {
    // 调用注册用户名服务
    search.isFriend(req, res);
  });

  // 3、搜索群
  app.post('/search/group', (req, res) => {
    // 调用注册用户名服务
    search.searchGroup(req, res);
  });

  // 4、判断是否在群内
  app.post('/search/isgroup', (req, res) => {
    // 调用注册用户名服务
    search.isGroup(req, res);
  });
}
