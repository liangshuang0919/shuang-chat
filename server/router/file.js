// 用来处理文件上传的路由
const path = require('path'); // 导入 path 内置模块
const multer = require('multer'); // 导入 multer 插件
const mkdir = require('../dao/mkdir'); // 导入自动创建文件夹的方法

// 自定义控制文件的存储
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // 后端动态存储文件的路径，需要前端返回一个路径
    const fileUrl = req.body.fileUrl;
    // 动态创建文件夹
    mkdir.mkdirs('../data/' + fileUrl, err => {
      console.log(err);
    });
    cb(null, './data/' + fileUrl); // 存放在 data 目录下的 test 文件夹中
  },
  filename: function(req, file, cb) {
    // 将给上传的文件命名的任务交给前端去完成，后端直接获取到即可
    const fileName = req.body.fileName;
    // path.extname(file.originalname) 获取上传的文件的后缀名
    cb(null, fileName + path.extname(file.originalname));
  }
});

// 注册自定义控制文件的存储
const upload = multer({ storage: storage });

module.exports = (app) => {
  // 1、前端文件上传
  // req.files 是 `photos` 文件数组的信息
  // req.body 将具有文本域数据，如果存在的话
  app.post('/files/upload', upload.array('file', 10), (req, res, next) => {
    const fileUrl = req.body.fileUrl; // 前端传递过来的文件夹名
    const fileName = req.files[0].filename; // 前端传递过来的文件名
    const files = req.files; // 获取文件信息

    // 拼接文件夹名
    const filePath = '/' + fileUrl + '/' + fileName;

    res.json({ status: 200, files: files, filePath: filePath }); // 返回给前端
  })
}
