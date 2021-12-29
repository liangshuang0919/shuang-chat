const express = require('express'); // 导入 express框架
const app = express(); // 初始化
const port = 8888; // 端口号
const jwt = require('./dao/jwt'); // 导入 token 模块

// socket.io 模块
const server = app.listen(8001); // socket.io 独立端口
const io = require('socket.io').listen(server); // 导入 socket.io，并监听独立端口
require('./dao/socket')(io); // 导入后端处理 websocket 通信文件

// 处理跨域
app.all("*", (req, res, next) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  // 允许的header类型
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("X-Powered-By", " 3.2.1")
    // 这段是为了方便返回 JSON
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method === 'OPTIONS') {
    // 让 OPTIONS 请求快速返回
    res.sendStatus(200)
  } else {
    next()
  }
});

// 解析前端请求 body 中的数据
// 允许上传的数据大小最大为 50mb
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// 解析前端发送的获取静态资源的请求
app.use(express.static(__dirname + '/data'))

// 进入路由之前，先进行 token 判断
app.use((req, res, next) => {
  if (typeof req.body.token !== 'undefined') {
    // 前端携带了 token，就进行判断
    const token = req.body.token;
    const result = jwt.verifyToken(token); // 对 token 进行解析
    if (result === 1) {
      // token 正确，通过验证，继续执行下一步
      next();
    } else {
      // token 不正确，未通过验证
      res.json({ status: 401, message: 'token 失效，请重新登录！' })
    }
  } else {
    // 前端没有携带了 token，就不进行判断
    next();
  }
})

require('./router/chat')(app); // 导入聊天路由文件
require('./router/file')(app); // 导入处理文件上传路由文件
require('./router/friend')(app); // 导入好友路由文件
require('./router/index')(app); // 导入路由文件
require('./router/register')(app); // 导入注册页面路由文件
require('./router/login')(app); // 导入登录页面路由文件
require('./router/search')(app); // 导入搜索功能路由文件
require('./router/userInfo')(app); // 导入用户详情路由文件
require('./router/userList')(app); // 导入首页用户列表路由文件

// 处理找不到的地址的中间件
app.use((req, res, next) => {
  const err = new Error('Not Found'); // 设置错误信息
  err.status = 404; // 设置状态码
  next(err); // 将错误信息传递下去
})

// 出现错误处理
app.use((err, req, res, next) => {
  res.status(err.status || 500); // 设置状态码
  // 返回给前端错误信息
  res.json({
    status: err.status,
    message: err.message
  });
})

// 监听 web 服务器
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
