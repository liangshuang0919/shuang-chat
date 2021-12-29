// 密码加密工具
const bcrypt = require('bcryptjs'); // 导入 bcrypt 加密插件

// 生成 hash 密码
// password 是前端传过来的密码
exports.encryption = (password) => {
  // 生成一个随机数
  const salt = bcrypt.genSaltSync(10);

  // 生成 hash 密码
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

// 解密的方法
// password 是前端传过来的密码
// hash 是数据库中存入的加密密码
exports.verification = (password, hash) => {
  // 将密码和数据库中的 hash 进行对比
  const decrypt = bcrypt.compareSync(password, hash);

  return decrypt;
}
