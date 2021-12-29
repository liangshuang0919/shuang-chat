// 用来连接数据库的文件
const mongoose = require('mongoose'); // 导入 mongoose

// 连接数据库
const db = mongoose.createConnection('mongodb://localhost:27017/shuangchat')

// 连接失败的话，返回连接失败的信息
db.on('error', console.error.bind(console, 'connection error:'));

// 连接成功的话，返回连接成功的信息
db.once('open', function() {
  console.log('连接数据库 shuangchat 成功！');
});

module.exports = db // 暴露数据库
