// 用来处理数据库的数据
// 导入用到的模块
const bcrypt = require('../dao/bcrypt'); // 导入封装的加密方法
const dbmodel = require('../model/dbmodel'); // 导入数据库模型
const jwt = require('../dao/jwt'); // 导入 token 模块

// 导入数据库的表
const User = dbmodel.model('User'); // 获取到用户表
const Friend = dbmodel.model('Friend'); // 获取到好友表
const Message = dbmodel.model('Message'); // 获取一对一消息表
const Group = dbmodel.model('Group'); // 获取群表
const GroupNumber = dbmodel.model('GroupNumber'); // 获取群成员表
const GroupMessage = dbmodel.model('GroupMessage'); // 获取群消息表

// 6、首页列表
// 6.8 分页获取一对一聊天数据
exports.getFriendMsgPage = (data, res) => {
  // data 需要 uid，fid，nowPage（当前聊天页面），pageSize（每一页数据的条数）
  // 跳过多少条信息（就是过滤掉前面已经加载的消息数据）
  const skipNum = data.nowPage * data.pageSize;

  const query = Message.find({}); // 查询数据
  // 查询条件
  query.where({ $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] });
  // 查找 userId 关联的 user 对象
  query.populate('userId');
  // 排序方式，最后通信时间，当值为 -1 的时候，是倒叙排，从大到小；是 1 的话是正序排，从小到大
  query.sort({ 'time': -1 });
  // 跳过的条数（已经发给前端的数据）
  query.skip(skipNum);
  // 每页查询多少条数据
  query.limit(data.pageSize);
  // 输出查询结果
  query.exec().then((result) => {
    // 成功的回调
    const msgData = result.map(item => {
      return {
        id: item._id, // 消息的 id
        message: item.message,
        types: item.types, // 聊天内容的类型
        time: item.time, // 消息时间
        userId: item.userId._id, // 发送的消息来自谁，就是用户 id
        image: item.userId.image
      }
    });

    res.json({ status: 200, result: msgData })
  }).catch(err => {
    res.status(500).json({ status: 500 })
  })
}

// 6.7 当群消息被读取后，将对应用户的消息状态置为已读，0
exports.updateGroupMsgState = (data, res) => {
  const wherestr = { 'groupId': data.gid, 'userId': data.uid }; // 搜索项
  const updateStr = { 'tips': 0 }; // 修改内容
  GroupNumber.updateOne(wherestr, updateStr, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).json({ status: 200 });
    }
  })
}

// 6.6 按要求获取群消息
exports.getGroupMsg = (gid, res) => {
  const query = GroupMessage.findOne({});
  // 查询条件
  query.where({ 'groupId': gid });
  // 关联的用户表
  query.populate('userId');
  // 排序方式，最后通讯时间，当值为 -1 的时候，是倒叙排，从大到小；是 1 的话是正序排，从小到大
  query.sort({ 'time': -1 });
  // 输出查询结果
  query.exec().then((result) => {
    // 成功的回调
    const message = {
      userName: result.userId.userName, // 发送消息的用户
      message: result.message, // 通讯消息
      types: result.type, // 消息类型
      time: result.time, // 最后通讯时间
    }

    res.json({ status: 200, result: message })
  }).catch(err => {
    res.status(500).json({ status: 500 })
  })
}

// 6.5 按要求获取群列表
// id 为用户所在的群 id
exports.getGrouprList = (uid, res) => {
  const query = Group.find({});
  // 查询条件
  query.where({ 'userId': uid });
  // 查找 groupId 关联的 group 对象
  // 在创建表的时候，群成员表的 id 关联到了群表：ref: 'Group'
  // 可以根据群 id 去群表中查找对应的群数据
  query.populate('groupId');
  // 排序方式，最后通信时间，当值为 -1 的时候，是倒叙排，从大到小；是 1 的话是正序排，从小到大
  query.sort({ 'lastTime': -1 });
  // 输出查询结果
  query.exec().then((result) => {
    // 成功的回调
    const groupList = result.map(item => {
      return {
        groupId: item.groupId._id,
        groupName: item.groupId.groupName, // 根据群 id 去查找群的用户名
        image: item.groupId.image, // 根据群 id 去查找群的头像
        nickName: item.nickName,
        lastTime: item.lastTime,
        tips: item.tips // 未读消息数
      }
    });

    res.json({ status: 200, result: groupList })
  }).catch(err => {
    res.status(500).json({ status: 500 })
  })
}

// 6.4 当一对一通讯用户已经读取后，将消息状态置为已读，0
exports.updateFriendMsgState = (data, res) => {
  const wherestr = { 'userId': data.uid, 'friendId': data.fid, 'state': 1 }; // 搜索项
  const updateStr = { 'state': 0 }; // 修改内容
  Message.updateMany(wherestr, updateStr, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).json({ status: 200 });
    }
  })
}

// 6.3 获取一对一通讯未读消息数
exports.getFriendUnreadMsgNum = (data, res) => {
  const wherestr = { 'userId': data.uid, 'friendId': data.fid, 'state': 1 }; // 搜索项
  Message.countDocuments(wherestr)
    .then((result) => {
      // result 就是汇总的未读消息的总个数
      res.status(200).json({ status: 200, result: result });
    })
    .catch((err) => {
      res.status(500)
    })
}

// 6.2 按要求获取一对一消息
exports.getFriendMsg = (data, res) => {
  const query = Message.findOne({});
  // 查询条件
  query.where({ $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] });
  // 排序方式，最后通讯时间，当值为 -1 的时候，是倒叙排，从大到小；是 1 的话是正序排，从小到大
  query.sort({ 'time': -1 });
  // 输出查询结果
  query.exec().then((result) => {
    // 成功的回调
    const message = {
      message: result.message, // 通讯消息
      time: result.time, // 最后通讯时间
      types: result.types // 消息类型
    }

    res.json({ status: 200, result: message })
  }).catch(err => {
    res.status(500).json({ status: 500 })
  })
}

// 6.1 按要求获取用户列表
exports.getUserList = (data, res) => {
  const query = Friend.find({});
  // 查询条件
  query.where({ 'userId': data.uid, 'state': data.state });
  // 查找 friendId 关联的 user 对象
  // 在创建表的时候，好友表的 id 关联到了用户表：ref: 'User'
  // 可以根据好友 id 去用户表中查找对应的用户数据
  query.populate('friendId');
  // 排序方式，最后通信时间，当值为 -1 的时候，是倒叙排，从大到小；是 1 的话是正序排，从小到大
  query.sort({ 'lastTime': -1 });
  // 输出查询结果
  query.exec().then((result) => {
    // 成功的回调
    const userList = result.map(item => {
      return {
        friendId: item.friendId._id, // 根据好友 id 去查找好友的 id
        userName: item.friendId.userName, // 根据好友 id 去查找好友的用户名
        image: item.friendId.image, // 根据好友 id 去查找好友的头像
        nickName: item.nickName,
        lastTime: item.lastTime
      }
    });

    res.json({ status: 200, result: userList })
  }).catch(err => {
    res.status(500).json({ status: 500 })
  })
}

// 5、好友操作
// 5.6 拒绝好友申请/删除好友
// 这两个功能逻辑都是一样的，将这两个好友表删除即可
exports.rejectOrDeleteFriend = (data, res) => {
  // 搜索项
  const wherestr = { $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] };

  Friend.deleteMany(wherestr, (err, result) => {
    if (err) {
      res.json({ status: 500 })
    } else {
      Message.deleteMany(wherestr, (err, result) => {
        if (err) {
          res.json({ status: 500 })
        } else {
          res.status(200).json({ status: 200, message: '拒绝好友申请/删除好友成功！' })
        }
      })
    }
  })
}

// 5.5 同意好友申请
// 其实就是修改好友状态即可
exports.agreeFriendApply = (data, res) => {
  // 搜索项
  const wherestr = { $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] };

  Friend.updateMany(wherestr, { 'state': 0 }, (err, result) => {
    if (err) {
      res.json({ status: 500 })
    } else {
      res.status(200).json({ status: 200, message: '同意好友申请！' })
    }
  })
}

// 5.4 添加好友的功能
exports.applyFriend = (data, res) => {
  // 判断是否为已经申请过好友请求
  const wherestr = { 'userId': data.uid, 'friendId': data.fid }; // 搜索项

  Friend.countDocuments(wherestr)
    .then((result) => {
      // 如果 result 为 0 为初次申请
      if (result === 0) {
        // 创建好友表
        this.buildFriendSchema(data.uid, data.fid, 2); // 当前用户的好友表
        this.buildFriendSchema(data.fid, data.uid, 1); // 好友方的好友表
      } else {
        // 已经申请过好友的话，只需要更新一下两者的最后通信时间即可
        this.friendMsgLastTime(data);
      }

      // 创建一下好友一对一消息表
      this.buildFriendMsg(data.uid, data.fid, data.msg, 0, res)
    })
    .catch((err) => {
      res.status(500)
    })
}

// 5.3 好友最后通信时间
exports.friendMsgLastTime = (data) => {
  // 搜索项
  const wherestr = { $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] };
  const updateStr = { 'lastTime': new Date() }; // 修改项，修改最后通信时间

  Friend.updateMany(wherestr, updateStr, (err, result) => {
    if (err) {
      console.log('更新最后通信时间出错！');
    } else {
      // res.status(200).json({ status: 200 })
    }
  })
}

// 5.2 添加一对一消息表
exports.buildFriendMsg = (uid, fid, msg, type, res) => {
  // 将好友信息插入好友表中
  const data = {
    userId: uid, // 用户 ID
    friendId: fid, // 好友 ID
    message: msg, // 好友消息
    types: type, // 内容类型（0 表示文字；1 表示图片链接；2 表示音频链接）
    state: 1, // 消息状态（0 表示已读、1 表示未读）
    time: new Date() // 发送消息时间
  }

  const message = new Message(data) // 创建好友表

  message.save((err, result) => {
    if (err) {
      if (res) {
        res.status(500); // 失败返回 500
      }
    } else {
      if (res) {
        res.status(200).json({ status: 200, message: '发送消息成功！' });
      }
    }
  });
}

// 5.1 添加好友表功能
// state 是两个用户是否为好友的状态
exports.buildFriendSchema = (uid, fid, state, res) => {
  // 将好友信息插入好友表中
  const data = {
    userId: uid, // 用户 id
    friendId: fid, // 好友 id
    state: state, // 好友状态
    time: new Date(), // 成为好友的时间
    lastTime: new Date() // 最后通信时间
  }

  const friend = new Friend(data) // 创建好友表

  friend.save((err, result) => {
    if (err) {
      console.log('创建好友表出错！');
    } else {
      // res.status(200).json({ status: 200 })
    }
  })
}

// 4、用户详情页面
// 4.4 修改好友昵称
exports.updateFriendNickName = (data, res) => {
  const wherestr = { 'userId': data.uid, 'friendId': data.fid };
  const updateStr = { 'nickName': data.nickName }; // 要修改的数据的字段
  // updateOne 方法是 mongoose 中更新一条数据的方法
  Friend.updateOne(wherestr, updateStr, (err, result) => {
    if (err) {
      // 修改失败
      res.status(500).json({ status: 500 })
    } else {
      // 修改成功
      res.status(200).json({ status: 200, message: '修改备注成功！' })
    }
  })
}

// 4.3 获取好友昵称
exports.getFriendNickName = (data, res) => {
  const wherestr = { 'userId': data.uid, 'friendId': data.fid };
  const friendNickName = { 'nickName': 1 };

  Friend.findOne(wherestr, friendNickName, (err, result) => {
    if (err) {
      // 获取失败
      res.status(500).json({ status: 500 })
    } else {
      // 获取成功
      res.status(200).json({ status: 200, result: result })
    }
  })
}

// 4.2 修改用户数据
// 封装的修改数据的函数
const handleUpdate = (id, update, res, result = '') => {
  User.findByIdAndUpdate(id, update, (err, updateData) => {
    if (err) {
      // 修改失败
      res.status(500).json({ status: 500 })
    } else {
      // 修改成功
      res.status(200).json({ status: 200, message: '修改数据成功！' })
    }
  });
}

exports.userUpdate = (data, res) => {
  let updateStr = {}; // 要修改的数据的字段

  // 判断是否有密码
  if (typeof data.password !== 'undefined') {
    // 有密码
    User.find({ '_id': data.id }, { 'password': 1 }, (err, result) => {
      if (err) {
        res.status(500).json({ status: 500 });
      } else {
        if (result === '') {
          res.status(400).json({
            status: 400,
            message: '对不起，该用户名/邮箱未注册！'
          });
        }
        // result 就是最终查询到的对应的完整数据
        result.map((e) => {
          // 使用封装的解密方法进行解密，返回的是一个 Boolean 值
          const pwdMacth = bcrypt.verification(data.password, e.password);
          // 如果解密成功（匹配）
          if (pwdMacth) {
            // 1、如果修改的是密码，还需要先加密
            if (data.type === 'password') {
              // 进行密码加密
              const pws = bcrypt.encryption(data.data);
              // 将匹配成功的数据存入要修改的字段中
              updateStr[data.type] = pws;
              // 调用更新数据的方法
              handleUpdate(data.id, updateStr, res);
            } else {
              // 将匹配成功的数据存入要修改的字段中
              updateStr[data.type] = data.data;
              handleUpdate(data.id, updateStr, res);
            }
          } else {
            // 密码匹配不成功（密码错误）
            res.json({ status: 400, message: '密码匹配失败！' });
          }
        })
      }
    })
  } else if (data.type === 'userEmail') {
    updateStr[data.type] = data.data;
    // 如果用户修改邮箱的话，需要先匹配数据库是否该邮箱已被占用
    // mongoose 中匹配个数的方法 countDocuments()，返回的数为 0 才可以使用
    User.countDocuments(updateStr)
      .then((result) => {
        if (result === 0) {
          handleUpdate(data.id, updateStr, res, result);
        } else {
          res.json({ status: 300, message: '该邮箱已存在' })
        }
      })
      .catch((err) => {
        res.status(500)
      })
  } else if (data.type === 'userName') {
    updateStr[data.type] = data.data;
    // 修改用户名的话，也需要匹配数据库是否有重名的
    User.countDocuments(updateStr)
      .then((result) => {
        if (result === 0) {
          handleUpdate(data.id, updateStr, res, result);
        } else {
          res.json({ status: 300, message: '该用户名已存在' })
        }
      })
      .catch((err) => {
        res.status(500)
      })
  } else {
    // 没有密码
    // 将匹配成功的数据存入要修改的字段中
    updateStr[data.type] = data.data;
    handleUpdate(data.id, updateStr, res);
  }
}

// 4.1 搜索用户详情
exports.userInfo = (id, res) => {
  const wherestr = { '_id': id };
  // 给 password 设置为 0，返回数据的时候不会返回 password
  // const userInfoData = { 'password': 0 };
  User.findOne(wherestr, { 'password': 0 }, (err, result) => {
    if (err) {
      res.status(500).json({ status: 500 });
    } else {
      res.status(200).json({ status: 200, result: result })
    }
  });
}

// 3、搜索功能
// 3.4 判断用户是否在群内
// uid 是用户 id；gid 是群的 id
exports.isGroup = (uid, gid, res) => {
  const wherestr = { 'groupId': gid, 'userId': uid };
  // 匹配好友表的数据
  GroupNumber.findOne(wherestr, (err, result) => {
    if (err) {
      res.status(500).json({ status: 500 });
    } else {
      if (result) {
        // 在群内
        res.status(200).json({ status: 200, result: result });
      } else {
        // 不在群内
        res.status(400).json({ status: 400 });
      }
    }
  })
}

// 3.3 搜索群
exports.searchGroup = (data, res) => {
  let wherestr = null; // 搜索的数据

  if (data === 'shuangChat') {
    // 彩蛋，搜索 shuangChat，将所有用户搜索出来
    wherestr = {};
  } else {
    // $regex 模糊查找
    wherestr = { $or: [{ 'groupName': { $regex: data } }] };
  }

  // 搜索后需要返回的数据
  const searchData = { 'groupName': 1, 'image': 1 };

  // 在用户表查找
  Group.find(wherestr, searchData, (err, result) => {
    if (err) {
      res.status(500).json({ status: 500 });
    } else {
      res.status(200).json({ status: 200, result: result });
    }
  })
}

// 3.2 判断是否为好友
// uid 是用户 id；fid 是好友的 id
exports.isFriend = (uid, fid, res) => {
  const wherestr = { 'userId': uid, 'friendId': fid, 'state': 0 };
  // 匹配好友表的数据
  Friend.findOne(wherestr, (err, result) => {
    if (err) {
      res.status(500).json({ status: 500 });
    } else {
      if (result) {
        // 搜索到是好友数据
        res.status(200).json({ status: 200, result: result });
      } else {
        // 搜索到不是好友
        res.json({ status: 400 });
      }
    }
  })
}

// 3.1 搜索用户，添加好友功能
// data 是前端传递过来的搜索词
exports.searchUser = (data, res) => {
  let wherestr = null; // 搜索的数据

  if (data === 'shuangChat') {
    // 彩蛋，搜索 shuangChat，将所有用户搜索出来
    wherestr = {};
  } else {
    // $regex 模糊查找
    wherestr = { $or: [{ 'userName': { $regex: data } }, { 'userEmail': { $regex: data } }] };
  }

  // 搜索后需要返回的数据
  const searchData = { 'userName': 1, 'userEmail': 1, 'image': 1 };

  // 在用户表查找
  User.find(wherestr, searchData, (err, result) => {
    if (err) {
      res.status(500).json({ status: 500 });
    } else {
      res.status(200).json({ status: 200, result: result });
    }
  })
}

// 2、登录功能
// 1.1 用户登录验证（使用 token 验证）
// data 是前端传递的用户名/邮箱，password 是密码；res 是要响应的东西
exports.userMatch = (data, password, res) => {
  // 使用 mongoose 的 $or 方法，搜索用户名/邮箱
  const wherestr = { $or: [{ 'userName': data }, { 'userEmail': data }] };
  // 要返回给前端的数据，
  // 前面是要输出的数据的 key 值，后面的 1 表示输出，0 表示不输出
  const outData = { 'userName': 1, 'userEmail': 1, 'password': 1, 'image': 1 }

  // mongoose 的 find 方法
  // 参数一是要查询的数据；参数二是要返回给前端的数据；参数三是一个回调函数
  User.find(wherestr, outData, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      // 如果没有找到对应的用户名/邮箱，说明数据库没有注册过该用户名/邮箱
      if (result === '') {
        res.json({ status: 400, message: '对不起，该用户名/邮箱未注册！' });
      }
      // result 就是最终查询到的对应的完整数据
      result.map((e) => {
        // 使用封装的解密方法进行解密，返回的是一个 Boolean 值
        const pwdMacth = bcrypt.verification(password, e.password);

        // 如果解密成功（匹配）
        if (pwdMacth) {
          // 通过数据中的 _id 生成 token
          const token = jwt.generateToken(e._id);

          // 将要传递给前端的数据进行整合
          const data = {
            id: e._id,
            userName: e.userName,
            userEmail: e.userEmail,
            image: e.image,
            token: token
          }

          res.status(200).json({ status: 200, result: data })
        } else {
          // 密码匹配不成功（密码错误）
          res.json({ status: 400, message: '密码错误' })
        }
      })
    }
  })
}

// 1、注册功能
// 1.2 用户表中匹配用户名和邮箱（匹配个数，0 个说明没有，1 个说明已经存在）
// data 传过来的数据
// type 传过来的类型（用户名还是邮箱）
exports.conutUserNumber = (data, type, res) => {
  // 匹配项
  let wherestr = {};
  // 下面的写法相当于：wherestr = { 'type': data }
  wherestr[type] = data;

  // mongoose 中匹配个数的方法 countDocuments()
  User.countDocuments(wherestr)
    .then((result) => {
      res.status(200).json({ status: 200, result: result }); // 成功返回 200 和查询结果
    })
    .catch((err) => {
      res.status(500)
    })
}

// 1.1 新建用户
exports.buildUser = (userName, userEmail, password, res) => {
  // 进行密码加密
  const pws = bcrypt.encryption(password);

  // 将用户信息插入用户表中
  const data = {
    userName: userName, // 用户名
    password: pws, // 密码
    userEmail: userEmail, // 邮箱
    time: new Date() // 注册时间
  }

  const user = new User(data) // 创建用户表

  user.save((err, result) => {
    if (err) {
      res.status(500) // 失败返回 500
    } else {
      res.status(200).json({ status: 200, message: "注册用户成功！" })
    }
  })
}
