// 用来生成 token 和解析的功能文件
// 导入 jsonwebtoken 插件
const jwt = require('jsonwebtoken');

// 解析时候的签名，用一个固定的
const secret = 'shuangchat';

// 1、生成 token 的方法
exports.generateToken = (id, res) => {
  const payload = {
    id: id, // 数据库中某一个用户的 id
    time: new Date() // 创建时间
  };

  // 生成的 token，使用 jwt 进行签名
  const token = jwt.sign(payload, secret, {
    expiresIn: 60 * 60 * 24 * 120 // 过期时间
  })

  return token; // 导出 token
}

// 2、解码 token 的方法
exports.verifyToken = (token) => {
  let payload = null; // 返回的结果
  jwt.verify(token, secret, (err, result) => {
    // 这个是判断 token 是否正确的回调函数
    if (err) {
      // token 不正确，给 payload 赋值为 0
      payload = 0
    } else {
      // token 正确，给 payload 赋值为 1
      payload = 1
    }
  });

  return payload; // 返回解码的 token
}
