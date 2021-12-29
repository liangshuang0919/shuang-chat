// 测试用的假数据
export default {
	// 首页好友信息数据
	friends() {
		const friendArr = [{
			id: 1,
			imgSrc: require('../../static/testImg/touxiang1.jpg'),
			infoNum: 0,
			userName: '张三',
			userEmail: '123@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 2,
			imgSrc: require('../../static/testImg/touxiang2.jpg'),
			infoNum: 19,
			userName: '李四',
			userEmail: '1467612@qq.com',
			time: '2021-12-10 14:11',
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 3,
			imgSrc: require('../../static/testImg/touxiang3.jpg'),
			infoNum: 29,
			userName: '王五',
			userEmail: '15615@qq.com',
			time: '2021-12-09 14:11',
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 4,
			imgSrc: require('../../static/testImg/touxiang4.jpg'),
			infoNum: 39,
			userName: '梁六',
			userEmail: '89413@qq.com',
			time: '2021-12-11 14:11',
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 5,
			imgSrc: require('../../static/testImg/touxiang5.jpg'),
			infoNum: 49,
			userName: '熊七',
			userEmail: '1234441@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 6,
			imgSrc: require('../../static/testImg/touxiang1.jpg'),
			infoNum: 100,
			userName: '张三',
			userEmail: '77561@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 7,
			imgSrc: require('../../static/testImg/touxiang2.jpg'),
			infoNum: 19,
			userName: '李四',
			userEmail: '17048948@qq.com',
			time: '2021-12-11 14:11',
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 8,
			imgSrc: require('../../static/testImg/touxiang3.jpg'),
			infoNum: 29,
			userName: '王五',
			userEmail: '4949841@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 9,
			imgSrc: require('../../static/testImg/touxiang4.jpg'),
			infoNum: 39,
			userName: '梁六',
			userEmail: '589891541@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 10,
			imgSrc: require('../../static/testImg/touxiang5.jpg'),
			infoNum: 49,
			userName: '熊七',
			userEmail: '0484848@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 11,
			imgSrc: require('../../static/testImg/touxiang1.jpg'),
			infoNum: 100,
			userName: '张三',
			userEmail: '848195@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 12,
			imgSrc: require('../../static/testImg/touxiang2.jpg'),
			infoNum: 19,
			userName: '李四',
			userEmail: '68848481@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 13,
			imgSrc: require('../../static/testImg/touxiang3.jpg'),
			infoNum: 29,
			userName: '王五',
			userEmail: '489181@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 14,
			imgSrc: require('../../static/testImg/touxiang4.jpg'),
			infoNum: 39,
			userName: '梁六',
			userEmail: '5258987@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}, {
			id: 15,
			imgSrc: require('../../static/testImg/touxiang5.jpg'),
			infoNum: 49,
			userName: '熊七',
			userEmail: '984815@qq.com',
			time: new Date(),
			content: '你好，好久不见！凉爽爽爽爽爽爽爽爽爽爱冉思婕，么么哒！考研加油！等你回来！'
		}]
		
		return friendArr;
	},
	// 好友表
	isFriend() {
		const friends = [
			{
				userId: 1,
				friend: 2
			},
			{
				userId: 1,
				friend: 5
			},
			{
				userId: 1,
				friend: 6
			},
			{
				userId: 1,
				friend: 8
			},
		]
		
		return friends
	},
	// 好友聊天记录
	message() {
		const msg = [
			{
				msgId: 115, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: {
					localName: '四川轻化工大学宜宾校区', // 定位的位置名
					localAddress: '四川省宜宾市临港区四川轻化工大学宜宾校区 B8', // 定位的详细地址
					localLatitude: '39.909473', // 定位的纬度
					localLongitude: '116.39730899999999' // 定位的经度
				}, // 消息
				types: 3, // 消息类型
				time: new Date() - 1000 * 60 * 1, // 发送时间
			},
			{
				msgId: 114, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: {
					localName: '四川轻化工大学宜宾校区', // 定位的位置名
					localAddress: '四川省宜宾市临港区四川轻化工大学宜宾校区 B8', // 定位的详细地址
					localLatitude: '28.758637', // 定位的纬度
					localLongitude: '104.649315' // 定位的经度
				}, // 消息
				types: 3, // 消息类型
				time: new Date() - 1000 * 60 * 1, // 发送时间
			},
			{
				msgId: 113, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: {
					voice: 'bb', // 音频
					time: 60 // 音频的时间
				}, // 消息
				types: 2, // 消息类型
				time: new Date() - 1000 * 60 * 7, // 发送时间
			},
			{
				msgId: 112, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: {
					voice: 'aa', // 音频
					time: 20 // 音频的时间
				}, // 消息
				types: 2, // 消息类型
				time: new Date() - 1000 * 60 * 7, // 发送时间
			},
			{
				msgId: 111, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '去的时候路上注意安全嗷', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 10, // 发送时间
			},
			{
				msgId: 0, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '去的时候路上注意安全嗷', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 13, // 发送时间
			},
			{
				msgId: 1, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: 'one.png', // 消息
				types: 1, // 消息类型
				time: new Date() - 1000 * 60 * 23, // 发送时间
			},
			{
				msgId: 2, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: '那个芭芭农场分享链接，你不用每天发，第二天直接上号在消息里点昨天的链接就行了', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 24, // 发送时间
			},
			{
				msgId: 3, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '那个芭芭农场分享链接，你不用每天发，第二天直接上号在消息里点昨天的链接就行了', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 36, // 发送时间
			},
			{
				msgId: 4, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: 'three.png', // 消息
				types: 1, // 消息类型
				time: new Date() - 1000 * 60 * 40, // 发送时间
			},
			{
				msgId: 5, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '复习了这么久 今天不得好好睡一觉嘛', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 57, // 发送时间
			},
			{
				msgId: 6, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: 'wu.jpg', // 消息
				types: 1, // 消息类型
				time: new Date() - 1000 * 60 * 58, // 发送时间
			},
			{
				msgId: 8, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: 'two.png', // 消息
				types: 1, // 消息类型
				time: new Date() - 1000 * 60 * 58 * 24, // 发送时间
			},
			{
				msgId: 9, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '刚写完作文 休息一下玩一会手机', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 60 * 25, // 发送时间
			},
			{
				msgId: 10, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '复习了这么久 今天不得好好睡一觉嘛', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 60 * 26, // 发送时间
			},
			{
				msgId: 11, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: 'four.png', // 消息
				types: 1, // 消息类型
				time: new Date() - 1000 * 60 * 60 * 26.2, // 发送时间
			},
			{
				msgId: 12, // 消息 id
				id: 'b', // 用户 id
				image: require('../../static/testImg/touxiang2.jpg'), // 用户头像
				message: '咱们主题是不是可以设置多少天后禁止评论', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 60 * 72, // 发送时间
			},
			{
				msgId: 13, // 消息 id
				id: 'a', // 用户 id
				image: require('../../static/testImg/touxiang1.jpg'), // 用户头像
				message: '刚写完作文 休息一下玩一会手机', // 消息
				types: 0, // 消息类型
				time: new Date() - 1000 * 60 * 60 * 90, // 发送时间
			},
		]
		return msg;
	}
}