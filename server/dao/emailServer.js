// 发送邮件服务的文件
const nodemailer = require('nodemailer'); // 导入 nodemailer 插件
const credentials = require('../config/credentials'); // 导入配置的证书

// 创建传输方式
const transporter = nodemailer.createTransport({
  service: 'qq', // qq 邮箱服务
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
})

// 注册发送邮件给用户
exports.emailSignUp = (email, res) => {
  // 需要发送给用户的信息
  const options = {
    from: '1551724864@qq.com', // 发送方
    to: email, // 接收方
    subject: '感谢您在 shuangChat 注册账号', // 邮箱标题
    // 邮箱 html 内容，可以写 html 格式
    html: `
      <span>shuangChat 欢迎您的加入
        <a href="http://localhost:8080/"> 登录</a>
      </span>
    `
  };

  // 发送邮件
  transporter.sendMail(options, (err, msg) => {
    if (err) {
      // res.send(err)
      // console.log(err);
    } else {
      // res.send('邮箱发送成功！' + msg.accepted)
    }
  })
}
