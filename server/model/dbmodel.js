// 连接数据库模型
const mongoose = require('mongoose') // 导入 mongoose 插件

const db = require('../config/db') // 导入数据库

const Schema = mongoose.Schema // 初始化 Schema

// 用户表
const UserSchema = new Schema({
  userName: { type: String }, // 用户名
  userEmail: { type: String }, // 邮箱
  password: { type: String }, // 密码
  sex: { type: Number, default: 2 }, // 性别，0 是男，1 是女，2 是未知
  birth: { type: Date, default: '2000-01-01' }, // 生日
  phone: { type: Number }, // 电话
  introduction: { type: String }, // 个性签名（介绍）
  image: { type: String, default: 'https://pic3.zhimg.com/80/v2-4515155ee43f6b7b5e0aeabe82a1b775_720w.jpg?source=1940ef5c' }, // 头像
  time: { type: Date } // 注册时间
});

// 好友表
const FriendSchema = new Schema({
  // 下面有些需要使用 Schema.Types.ObjectId 外键与其他的表进行关联起来
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户 ID
  friendId: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友 ID
  state: { type: Number }, // 好友状态（0 表示已成为好友；1 表示申请中；2 表示申请发送方，对方还未同意）
  nickName: { type: String, default: '' }, // 好友昵称
  time: { type: Date }, // 成为好友时间
  lastTime: { type: Date } // 好友最后通信时间
});

// 一对一消息表
const MessageSchema = new Schema({
  // 下面有些需要使用 Schema.Types.ObjectId 外键与其他的表进行关联起来
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户 ID
  friendId: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友 ID
  message: { type: String }, // 好友消息
  types: { type: String }, // 内容类型（0 表示文字；1 表示图片链接；2 表示音频链接；3 表示定位）
  state: { type: Number }, // 消息状态（0 表示已读、1 表示未读）
  time: { type: Date } // 发送消息时间
});

// 群表
const GroupSchema = new Schema({
  // 下面有些需要使用 Schema.Types.ObjectId 外键与其他的表进行关联起来
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // 群主 ID
  groupName: { type: String }, // 群名称
  image: { type: String, default: 'https://pic1.zhimg.com/80/v2-e54a2f32a23ef92a49cc3884e6057f48_720w.jpg' }, // 群头像
  notice: { type: String }, // 群公告
  time: { type: Date } // 群创建时间
});

// 群成员表
const GroupNumberSchema = new Schema({
  // 下面有些需要使用 Schema.Types.ObjectId 外键与其他的表进行关联起来
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群 ID
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // 群成员 ID
  nickName: { type: String }, // 群内昵称
  tips: { type: Number, default: 0 }, // 未读消息数
  shield: { type: Number, default: 0 }, // 是否屏蔽群消息（0 不屏蔽；1 屏蔽）
  time: { type: Date }, // 群创建时间
  lastTime: { type: Date } // 群成员最后通信时间
});

// 群消息表
const GroupMessagechema = new Schema({
  // 下面有些需要使用 Schema.Types.ObjectId 外键与其他的表进行关联起来
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群 ID
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // 群成员 ID
  message: { type: String }, // 群成员发送的消息
  types: { type: String }, // 内容类型（0 表示文字；1 表示图片链接；2 表示音频链接）
  time: { type: Date } // 发送消息时间
});

module.exports = db.model('User', UserSchema); // 导出用户表
module.exports = db.model('Friend', FriendSchema); // 导出好友表
module.exports = db.model('Message', MessageSchema); // 导出一对一消息表
module.exports = db.model('Group', GroupSchema); // 导出群表
module.exports = db.model('GroupNumber', GroupNumberSchema); // 导出群成员表
module.exports = db.model('GroupMessage', GroupMessagechema); // 导出群消息表
