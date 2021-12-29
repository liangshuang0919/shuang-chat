<template>
	<view class="content">
		<!-- 头部区域 -->
		<view class="top-bar">
			<!-- 左侧返回区域 -->
			<view class="top-bar-left" @tap="backHome"><image src="../../static/common/back.png"></image></view>
			<!-- 中间好友名 -->
			<view class="top-bar-center" v-if="nickName !== ''">{{ nickName }}</view>
			<view class="top-bar-center" v-else>{{ friendInfo.userName }}</view>
			<!-- 右侧好友详情按钮 -->
			<view class="top-bar-right" @tap="getFriendInfo">
				<image :src="friendInfo.image"></image>
			</view>
		</view>
		
		<!-- 聊天滚动区域 -->
		<!-- scroll-with-animation="true"  这是滚动动画 -->
		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<!-- 聊天区域 -->
			<view class="chat-main" :style="{ paddingBottom: inputh + 'px' }">
				<!-- 下拉加载更多消息 -->
				<view class="loading" v-show="isLoading">
					<image src="../../static/common/loading.png" :animation="animationData"></image>
				</view>
				
				<!-- 聊天记录 -->
				<view class="chat-ls" v-for="item in msgData" :key="item.id" :id="'msg' + item.id">
					<!-- 聊天时间 -->
					<view class="chat-time" v-if="item.time !== ''">{{ item.time | changeTime }}</view>
					<!-- 左侧好友聊天记录 -->
					<view class="msg-m msg-left" v-if="item.userId === friendInfo.id">
						<!-- 好友的头像 -->
						<image class="user-img" :src="friendInfo.image"></image>
						<!-- 好友的消息 -->
						<view class="message">
							<!-- 普通文本 -->
							<view v-if="item.types === '0'" class="msg-text">{{ item.message }}</view>
							<!-- 发送图片 -->
							<image v-else-if="item.types === '1'" class="msg-img" :src="item.message" mode="widthFix" @tap="previewImg(item.message)"></image>
							<!-- 发送音频 -->
							<view v-else-if="item.types === '2'" class="msg-text audio" :style="{ width: item.message.time * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								<image src="../../static/chatroom/yy.png"></image>
								{{ item.message.time }}″
							</view>
							<!-- 发送定位 -->
							<view v-else-if="item.types === '3'" class="map" @tap="openMap(item.message)">
								<!-- 位置名 -->
								<view class="map-name">{{ item.message.localName }}</view>
								<!-- 位置地址 -->
								<view class="map-address">{{ item.message.localAddress }}</view>
								<!-- 地图组件 -->
								<!-- <map class="map-area" :latitude="item.message.localLatitude" :longitude="item.message.localLongitude" :markers="covers(item.message)"></map> -->
								<image class="map-area" src="../../static/chatroom/map.png" mode="heightFix"></image>
							</view>
						</view>
					</view>
					
					<!-- 右侧用户友聊天记录 -->
					<view class="msg-m msg-right" v-if="item.userId === userInfo.id">
						<!-- 用户的头像 -->
						<image class="user-img" :src="userInfo.image"></image>
						<!-- 用户的消息 -->
						<view class="message">
							<!-- 普通文本 -->
							<view v-if="item.types === '0'" class="msg-text">{{ item.message }}</view>
							<!-- 发送图片 -->
							<image v-else-if="item.types === '1'" class="msg-img" :src="item.message" mode="widthFix" @tap="previewImg(item.message)"></image>
							<!-- 发送音频 -->
							<view v-else-if="item.types === '2'" class="msg-text audio" :style="{ width: item.message.time * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								{{ item.message.time }}″
								<image src="../../static/chatroom/yy.png"></image>
							</view>
							<!-- 发送定位 -->
							<view v-else-if="item.types === '3'" class="map" @tap="openMap(item.message)">
								<!-- 位置名 -->
								<view class="map-name">{{ item.message.localName }}</view>
								<!-- 位置地址 -->
								<view class="map-address">{{ item.message.localAddress }}</view>
								<!-- 地图组件 -->
								<!-- <map class="map-area" :latitude="item.message.localLatitude" :longitude="item.message.localLongitude" :markers="covers(item.message)"></map> -->
								<image class="map-area" src="../../static/chatroom/map.png" mode="heightFix"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 用来挤出下面的一块区域 -->
			<view class="padbt"></view>
		</scroll-view>
		
		<!-- 发送消息的聊天框 -->
		<submit @inputmsg="message" @heights="getHeight"></submit>
	</view>
</template>

<script>
	// 导入测试数据
	import datas from '@/commons/js/testData.js';
	
	// 导入自己封装的功能函数
	import myHooks from '@/commons/js/hooks.js';
	
	// 导入自己封装的发送消息框的组件
	import submit from '@/components/submit/submit.vue';
	
	// 播放语音的 API
	const innerAudioContext = uni.createInnerAudioContext();
	
	export default {
		data() {
			return {
				userInfo: {}, // 获取当前用户的数据
				friendInfo: {}, // 当前聊天好友的信息
				nickName: '', // 好友昵称
				msgData: [], // 消息数组
				imgData: [], // 用户发送的图片消息
				oldTime: new Date(), // 用来处理消息时间间隔的变量
				// 下面是 scroll-view 的滚动组件，监听滚动到的位置属性的值
				scrollToView: '', // 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
				inputh: '60', // 当下面的输入框上移时，让聊天页面的高度动态上移
				scrollAnimation: false, // 控制页面滚动动画
				animationData: {}, // 下拉加载更多的 loaing 图片的动画
				loadingTime: null, // 下拉加载动画的定时器
				isLoading: false, // 控制下拉加载的显示隐藏
				loadingFlag: true, // 防止重复加载的拦截器
				nowPage: 0, // 加载消息的页码
				pageSize: 10, // 请求的每页消息条数
				type: 0, // 聊天类型，0 为好友聊天，1 为群聊天
			}
		},
		components: {
			submit
		},
		filters:{
			// 处理时间函数
			changeTime(date) {
				return myHooks.handleTime(date)
			}
		},
		onLoad(e) {
			this.friendInfo = e // 获取到 url 中的数据
			this.getUserInfo() // 调用获取本地数据的函数
			this.getNickName() // 获取好友昵称
			this.getMsg(this.nowPage) // 获取聊天数据
			this.receiveMsgSocket() // 接收 socket 好友发送的消息
		},
		methods: {
			// 动态处理子组件整个输入框的高度
			getHeight(e) {
				this.scrollAnimation = false;
				this.inputh = (e + 10) + '' // 改变页面的 padding-bottom 值
				this.getBottom() // 再动态将页面显示最底部的信息
			},
			// 动态将页面滚动到底部
			getBottom() {
				this.scrollToView = '';
				this.$nextTick(() => {
					this.scrollToView = 'msg' + this.msgData[this.msgData.length - 1].id
				})
			},
			// 获取本地用户登录的数据
			getUserInfo() {
				try {
				  const value = uni.getStorageSync('shuangChat-user');
				  if (value) {
						// 如果有本地数据，就获取数据
				    this.userInfo.id = value.id
						this.userInfo.userName = value.userName
						this.userInfo.image = value.image
						this.userInfo.token = value.token
				  } else {
						// 如果没有本地数据，就跳转到登录页面
						uni.navigateTo({
						  url: '../Login/Login' 
						});
					}
				} catch (e) {
				  console.log('获取本地数据失败！')
				}
			},
			// 获取好友昵称
			getNickName() {
				uni.request({
					url: this.serverUrl + '/friend/getNickName',
					data: {
						uid: this.userInfo.id,
						fid: this.friendInfo.id,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userData = data.data
						// 如果请求成功
						if(userData.status === 200) {
							this.nickName = userData.result.nickName
						} else if(userData.status === 500) {
							uni.showToast({
								icon: 'error',
							  title: '服务器出错',
							  duration: 1250
							});
						}
					}
				})
			},
			// 获取聊天数据（后端真实的数据）
			getMsg(page) {
				uni.request({
					url: this.serverUrl + '/chat/getFriendMsgPage',
					data: {
						uid: this.userInfo.id,
						fid: this.friendInfo.id,
						nowPage: this.nowPage,
						pageSize: this.pageSize,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userData = data.data
						// 如果请求成功
						if(userData.status === 200) {
							const messageData = userData.result // 组中的数据
							
							// 对获取的消息的长度进行判断
							if(messageData.length > 0) {
								// 获取分页消息
								for(let i = 0; i < messageData.length; i++) {
									// 处理消息的时间间隔
									if(i < messageData.length - 1) {
										const time = myHooks.spacTime(this.oldTime, messageData[i].time, messageData[i + 1].time)
										if(time) {
											this.oldTime = time;
										}
										messageData[i].time = time;
									}
									// 处理消息内容为图片类型
									if(messageData[i].types === '1') {
										const imgData = JSON.parse(messageData[i].message).filePath
										this.imgData.unshift(this.serverUrl + imgData) // 插入图片数组
										messageData[i].message = this.serverUrl + imgData // 处理一下发送的图片的数据
									}
									
									// 如果是位置类型
									if(messageData[i].types === '3') {
										messageData[i].message = JSON.parse(messageData[i].message) // 处理一下发送的图片的数据
									}
									this.msgData.unshift(messageData[i]);
								}
							}
							
							// 当渠道的数据刚好是 10 条，就让页数 ++
							if(messageData.length === 10) {
								this.nowPage++
							} else {
								// 当页面已经加载到了最后一页，那么就不让页数 ++，让其等于 -1
								this.nowPage = -1 // 数据获取完毕
							}
							
							// 获取到消息的最后一个节点
							this.$nextTick(() => {
								this.scrollToView = 'msg' + this.msgData[messageData.length - 1].id // 定位到加载完数据的上一页的位置，不让其滚动到加载数据的顶部
							})
							
							clearInterval(this.loadingTime) // 清空定时器
							this.isLoading = false // 关闭加载样式
							this.loadingFlag = true // 开启加载
						} else if(userData.status === 500) {
							uni.showToast({
								icon: 'error',
							  title: '服务器出错',
							  duration: 1250
							});
						}
					}
				})
			},
			// 返回上一层页面
			backHome() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 右上角好友头像，查看好友更多的信息
			getFriendInfo() {
				// 路由跳转
				uni.navigateTo({
				  url: '../UserInfo/UserInfo?id=' + this.friendInfo.id + "&flag=true"
				});
			},
			// 下拉加载更多消息的 loading 图片的动画事件
			nextPage() {
				// 当加载的数据页数大于 0 的时候才回去执行下拉加载更多
				if(this.nowPage > 0 && this.loadingFlag) {
					this.isLoading = true
					
					this.loadingFlag = false // 关闭重复加载
					
					const animation = uni.createAnimation({
						duration: 750,
						timingFunction: 'step-start',
					})
							
					this.animation = animation
					
					let index = 1 // 用来叠加动画次数的计数器
					this.loadingTime = setInterval(() => {
						animation.rotate(index * 30).step()
						this.animationData = animation.export()
						index++
						if(index > 10) {
							// 1000 ms 加载数据
							this.getMsg(this.nowPage)
						}
					}, 100)
				}
			},
			// uni-app 预览图片的方法
			previewImg(message) {
				uni.previewImage({
					current: message,
					urls: this.imgData,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 接收子组件传递过来的消息
			message(e) {
				this.receiveMsg(e, 0)
			},
			// 接收子组件传递过来的消息
			receiveMsg(e, tip) {
				// socket 提交
				if(e.types === '0' || e.types === '3') {
					// 发送的是文字消息或者是定位，直接发送给后端
					this.sendMsgSocket(e);
				} else if(e.types === '1') {
					// 发送的是图片消息，将图片要存入后端的文件夹中，后端返回的是该图片的路径
					this.imgData.push(e.message); // 存入图片数组中
					
					const fileUrl = myHooks.formatTimeDay(new Date()) // 动态生成文件地址（我是以每天的日期作为文件夹的名字）
					const fileName = Date.now() + this.userInfo.id + Math.ceil(Math.random() * 10) // 动态生成文件名
					const uploadTask = uni.uploadFile({
						url:this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
						filePath: e.message,
						name: 'file',
						formData: {
							fileUrl: fileUrl,
							fileName: fileName
						},
						success: (uploadFileRes) => {
							// 整合一下要发送的图片数据
							const data = {
								message: uploadFileRes.data,
								types: '1'
							}
							this.sendMsgSocket(data) // 通过 socket 给后端发送数据
						}
					});
				} else if(e.types === '2') {
					// 发送的是语音
					const fileUrl = myHooks.formatTimeDay(new Date()) // 动态生成文件地址（我是以每天的日期作为文件夹的名字）
					const fileName = Date.now() + this.userInfo.id // 动态生成文件名
					const uploadTask = uni.uploadFile({
						url:this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
						filePath: e.message.voice,
						name: 'file',
						formData: {
							fileUrl: fileUrl,
							fileName: fileName
						},
						success: (uploadFileRes) => {
							// 整合一下要发送的图片数据
							const data = {
								message: uploadFileRes,
								types: '2'
							}
							this.sendMsgSocket(data) // 通过 socket 给后端发送数据
						}
					});
				}
				
				// tip 用来判断是 socket 的即时消息，tip = 0 表示自己发的
				this.scrollAnimation = true // 当要发送消息的时候，再开启页面的动画
				const id = this.msgData[this.msgData.length - 1].id + 1
				
				// 处理消息的时间间隔
				let nowTime = new Date()
				const lastMsgTime = this.msgData[this.msgData.length - 1].time
				
				const time = myHooks.spacTime1(lastMsgTime, nowTime)
				
				if(time) {
					this.oldTime = time;
				}
				nowTime = time;
				
				// json 字符串还原转换
				if(e.types === '3') {
					// 当消息类型为地图的时候
					e.message = JSON.parse(e.message)
				}
				
				const data = {
					id: id,
					userId: this.userInfo.id, // 发送者 ID，对于当前来说就是登录的用户 ID
					image: this.userInfo.image, // 用户头像
					message: e.message, // 消息
					types: e.types, // 消息类型
					time: nowTime, // 发送时间
				}
				
				this.msgData.push(data)
				
				this.$nextTick(() => {
					this.scrollToView = 'msg' + id
				})
			},
			// 将消息发送给后端
			sendMsgSocket(e) {
				// 如果是一对一好友聊天
				if(this.type === 0) {
					// e 是发送的消息数据；后面分别是当前用户 id，和聊天好友的 id
					this.socket.emit('friendmsg', e, this.userInfo.id, this.friendInfo.id);
				} else {
					// 群发送消息
					this.socket.emit('groupmsg', e, this.userInfo.id, this.friendInfo.id);
				}
			},
			// socket 接收好友的消息
			receiveMsgSocket() {
				this.socket.on('friendmsg', (message, fromId, type) => {
					if(fromId === this.friendInfo.id && type === 0) {
						// 只有要发送的好友的 ID 与当前页面对应的好友 ID 一致的时候才可以发送消息进行页面渲染
						
						this.scrollAnimation = true // 当要发送消息的时候，再开启页面的动画
						const id = this.msgData[this.msgData.length - 1].id + 1
						
						let userImage = '' // 发送方的头像
						if(fromId === this.userInfo.id) {
							// 如果是当前用户发送的，将头像替换成当前用户的
							userImage = this.userInfo.image
						} else {
							// 如果是好友发送的，将头像替换成好友的
							userImage = this.friendInfo.image
						}
						
						// 处理消息的时间间隔
						let nowTime = new Date()
						const lastMsgTime = this.msgData[this.msgData.length - 1].time
						
						const time = myHooks.spacTime1(lastMsgTime, nowTime)
						
						if(time) {
							this.oldTime = time;
						}
						nowTime = time;
						
						const data = {
							id: id,
							userId: fromId, // 发送者 ID，对于当前来说就是登录的用户 ID
							image: userImage, // 用户头像
							message: message.message, // 消息
							types: message.types, // 消息类型
							time: nowTime, // 发送时间
						}
						console.log(data)
						
						// 插入图片数组
						if(data.types === '1') {
							const imgData = JSON.parse(data.message).filePath
						  this.imgData.push(this.serverUrl + imgData) // 插入图片数组
							data.message = this.serverUrl + imgData // 处理一下发送的图片的数据
							this.msgData.push(data)
						} else {
							this.msgData.push(data) // 插入消息
						}
						
						this.getBottom() // 滚动到页面底部
					}
				})
			},
			// 播放音频的方法
			playVoice: function(e){
				innerAudioContext.src = e;
				innerAudioContext.play();
			},
			// 地图定位（我现在没有用这个）
			covers(message) {
				const map = [{
					latitude: message.latitude,
					longitude: message.longitude,
					iconPath: '../../static/chatroom/dw.png'
				}]
				return map;
			},
			// 查看定位地图
			openMap(local) {
				uni.openLocation({
					name: local.localName, // 位置名
					address: local.localAddress, // 具体地址
					latitude: local.localLatitude - 0, // 纬度
					longitude: local.localLongitude - 0, // 经度
					success: () => {}
				});
			},
		}
	}
</script>

<style lang="scss">
// 全局样式
page {
	height: 100%;
	background-color: rgba(244, 244, 244, 1);
}
.content {
	height: 100%;
	background-color: rgba(244, 244, 244, 1);
	// 头部样式
	.top-bar {
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		border-bottom: 1px solid $uni-border-color;
		background-color: rgba(244, 244, 244, 0.96);
		z-index: 1;

		.top-bar-left {
			padding: 0 29rpx;
			z-index: 2;
			image {
				width: 32rpx;
				height: 48rpx;
			}
		}

		.top-bar-center {
			height: 100%;
			text-align: center;
			line-height: 86rpx;
			font-size: 40rpx;
		}
		
		.top-bar-right {
			width: 66rpx;
			height: 66rpx;
			padding-right: 24rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 18rpx;
			}
		}
	}

	// 聊天区域样式
	.chat {
		height: 100%;		
		// 底部挤一块区域的盒子
		.padbt {
			width: 100%;
			height: var(--status-bar-height);
		}
		
		// 聊天主体区域
		.chat-main {
			display: flex;
			flex-direction: column;
			padding-top: 10rpx;
			padding-right: $uni-spacing-col-base;
			// padding-bottom: 120rpx;
			padding-left: $uni-spacing-col-base;
			margin-bottom: var(--status-bar-height);
			
			// 下拉加载更多图片的样式
			.loading {
				text-align: center;
				image {
					width: 60rpx;
					height: 60rpx;
				}
			}
			
			// 聊天消息区域
			.chat-ls {
				// 聊天时间
				.chat-time {
					padding: 20rpx 0;
					text-align: center;
					line-height: 34rpx;
					font-size: $uni-font-size-sm;
					color: rgba(39, 40, 50, 0.3);
				}
				
				// 聊天记录
				.msg-m {
					display: flex;
					padding: 20rpx 0;
					
					// 头像
					.user-img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}
					
					// 消息
					.message {
						max-width: 520rpx;
						
						// 文字消息内容
						.msg-text {
							padding: 18rpx 24rpx;
							line-height: 44rpx;
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							letter-spacing: 1rpx;
							word-wrap: break-word;
							word-break: break-all;
						}
						
						// 图片消息内容
						.msg-img {
							max-width: 400rpx;
							border-radius: $uni-border-radius-base;
						}
						
						// 音频消息
						.audio {
							display: flex;
							justify-content: space-between;
							align-items: center;
							min-width: 80rpx;
							max-width: 400rpx;
							
							image {
								width: 20rpx;
								height: 36rpx;
							}
						}
						
						// 地图信息
						.map {
							width: 500rpx;
							background-color: #fff;
							
							// 位置名
							.map-name {
								padding: 18rpx 24rpx 0 24rpx;
								line-height: 44rpx;
								font-size: $uni-font-size-lg;
								color: $uni-text-color;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							
							// 位置地址
							.map-address {
								padding: 0 24rpx;
								line-height: 44rpx;
								font-size: $uni-font-size-sm;
								color: $uni-text-color-disable;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							
							// 显示地图的区域
							.map-area {
								width: 500rpx;
								height: 260rpx;
							}
						}
					}
				}
				
				// 左侧好友消息
				.msg-left {
					flex-direction: row;
					
					.message {
						.msg-text {
							margin-left: 16rpx;
							background-color: #fff;
							border-radius: 0 20rpx 20rpx 20rpx;
						}
						.msg-img {
							margin-left: 16rpx;
						}
						.audio {
							image {
								transform: rotate(180deg);
							}
						}
						.map {
							overflow: hidden;
							margin-left: 16rpx;
							background-color: #fff;
							border-radius: 0 20rpx 20rpx 20rpx;
						}
					}
				}
				
				// 右侧用户消息
				.msg-right {
					flex-direction: row-reverse;
					
					.msg-text {
						margin-right: 16rpx;
						color: #fff;
						background-color: rgba(8, 152, 241, 1);
						border-radius: 20rpx 0 20rpx 20rpx;
					}
					.msg-img {
						margin-right: 16rpx;
					}
					.map {
						overflow: hidden;
						margin-right: 16rpx;
						border-radius: 20rpx 0 20rpx 20rpx;
					}
				}
			}
		}
	}
}
</style>
