<template>
	<!-- 主页面页面组件 -->
	<view class="content">
		<!-- 顶部导航区域 -->
		<view class="top-bar">
			<!-- 顶部导航左侧区域 -->
			<navigator :url="'../AddUser/AddUser?id=' + userInfo.id + '&flag=2'" class="top-bar-left">
				<image :src="userInfo.image"></image>
			</navigator>
			
			<!-- 顶部导航中间区域 -->
			<view class="top-bar-center">
				<image src="../../static/common/topBarImg.png" mode=""></image>
			</view>
			
			<!-- 顶部导航右侧区域 -->
			<view class="top-bar-right">
				  <!-- search 按钮 -->
					<view class="search" @tap="handleSearch">
						<image src="../../static/common/search.png" mode=""></image>
					</view>
					<!-- add 按钮 -->
					<view class="add">
						<image src="../../static/common/add.png" mode=""></image>
					</view>
			</view>
		</view>
		
		<!-- 好友列表区域 -->
		<view class="friends">
			<view>
				<!-- 请求好友的一项 -->
				<navigator url="../FriendApply/FriendApply">
					<view class="friend-apply">
						<!-- 好友列表左侧区域 -->
						<view class="friend-list-left apply-area">
							<!-- 头像 -->
							<image class="apply-image" :src="applyInfo.imgSrc"></image>
							<!-- 消息数的点点 -->
							<text class="tips" v-if="applyInfo.applyNum > 0">{{ applyInfo.applyNum > 99 ? '99+' : applyInfo.applyNum }}</text>
						</view>
						
						<!-- 好友列表右侧区域 -->
						<view class="friend-list-right">
							<!-- 上部区域 -->
							<view class="top">
								<!-- 用户名 -->
								<view class="name">{{ applyInfo.title }}</view>
								<!-- 最近的好友申请时间 -->
								<view v-if="applyInfo.lastTime !== ''" class="time">{{ applyInfo.lastTime | changeTime }}</view>
								<view v-else class="time">shuangChat</view>
							</view>
							
							<!-- 下部消息区域 -->
							<view class="bottom">{{ applyInfo.content }}</view>
						</view>
					</view>
				</navigator>
				
				<!-- 当没有好友的时候显示的样式 -->
				<view class="refresh" v-if="infoData.length === 0">
					<image class="ref-bg" src="../../static/index/noone.png"></image>
					<view class="ref-title">你还没有好友~</view>
					<view class="btn" @tap="handleSearch">搜寻好友</view>
				</view>
				
				<!-- 好友列表区域 -->
				<view  v-else class="friend-list" v-for="item in infoData" :key="item.id" @tap="handleChatroom(item)">
					<!-- 好友列表左侧区域 -->
					<view class="friend-list-left">
						<!-- 头像 -->
						<image :src="item.image"/>
						<!-- 消息数的点点 -->
						<text class="tips" v-if="item.infoNum > 0">{{ item.infoNum > 99 ? '99+' : item.infoNum }}</text>
					</view>
					
					<!-- 好友列表右侧区域 -->
					<view class="friend-list-right">
						<!-- 上部区域 -->
						<view class="top">
							<!-- 用户名 -->
							<view class="name" v-if="item.nickName !== ''">{{ item.nickName }}</view>
							<view class="name" v-else>{{ item.userName }}</view>
							<!-- 发送消息的时间 -->
							<view class="time">{{ item.lastTime | changeTime }}</view>
						</view>
						
						<!-- 下部消息区域 -->
						<view class="bottom">{{ item.message }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入测试数据
	import datas from '@/commons/js/testData.js';
	
	// 导入自己封装的功能函数
	import myHooks from '@/commons/js/hooks.js';
	
	export default {
		data() {
			return {
				// 用户登录的数据
				userInfo: {
					id: '',
					userName: '',
					image: '',
					token: ''
				},
				infoData: [],	// 首页好友消息数据
				friendApplyData: [], // 好友申请的数据
				// 申请好友那一项
				applyInfo: {
					imgSrc: '../../static/common/add-user.png',
					applyNum: 0, // 好友申请的数目
					title: '添加好友',
					lastTime: '', // 最近好友的申请时间
					content: '茫茫人海，相遇便是缘分'
				},
				isRefresh: false // 判断是否刷新过页面
			}
		},
		filters:{
			// 处理时间函数
			changeTime(date) {
				return myHooks.handleTime(date)
			}
		},
		onLoad() {
			this.getUserInfo() // 调用获取本地数据的函数
			this.getFriendInfo() // 调用获取首页好友消息函数
			this.friendApply() // 调用好友申请的接口
			this.join(this.userInfo.id)
			this.receiveMsgSocket() // 渲染最新的消息
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			this.infoData = []
			this.getFriendInfo() // 调用获取首页好友消息函数
			this.friendApply() // 调用好友申请的接口
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 750);
		},
		methods: {
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
			// 好友申请接口
			friendApply() {
				uni.request({
					url: this.serverUrl + '/user/getUserList',
					data: {
						uid: this.userInfo.id,
						state: 1,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userInfo = data.data // 获取到的后端返回的具体数据
						if(userInfo.status === 200) {
							const applyData = userInfo.result // 最终的数据
							if(applyData.length > 0) {
								this.applyInfo.applyNum = applyData.length // 获取好友申请的个数
								for(let i = 0; i < userInfo.result.length; i++) {
									// 获取最近的申请时间
									if(applyData[i].lastTime > this.applyInfo.lastTime) {
										this.applyInfo.lastTime = applyData[i].lastTime
									}
								}
							}
						} else if (userInfo.status === 500) {
							// 提示框
							uni.showToast({
								icon: 'error',
							  title: '服务器出错！',
							  duration: 1250
							});
						}
					}
				})
			},
			// 获取首页好友列表的函数
			async	getFriendInfo() {
				await	uni.request({
						url: this.serverUrl + '/user/getUserList',
						data: {
							uid: this.userInfo.id,
							state: 0,
							token: this.userInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userInfo = data.data // 获取到的后端返回的具体数据
							if(userInfo.status === 200) {
								const applyData = userInfo.result // 最终的数据
								if(applyData.length > 0) {
									for(let i = 0; i < applyData.length; i++) {
										this.getLeaveMessage(applyData, i) // 获取好友最新消息
										this.getFriendUnreadMsgNum(applyData, i) // 获取未读消息数
									}
								}
								this.getGroupInfo()
							} else if (userInfo.status === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
									title: '服务器出错！',
									duration: 1250
								});
							}
						}
					})
			},
			// 获取好友最新的消息
			async	getLeaveMessage(arr, index) {
				await	uni.request({
						url: this.serverUrl + '/user/getFriendMsg',
						data: {
							uid: this.userInfo.id,
							fid: arr[index].friendId,
							token: this.userInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userInfo = data.data // 获取到的后端返回的具体数据
							if(userInfo.status === 200) {
								const message = userInfo.result // 最终的数据
								// 处理页面显示最后一条信息的内容
								if(message.types === '0') {
									// 文字内容
									arr[index].message = message.message // 给这个数据添加一个留言的数据
								} else if(message.types === '1') {
									// 图片
									arr[index].message = '[图片]' // 给这个数据添加一个留言的数据
								} else if(message.types === '2') {
									arr[index].message = '[语音]' // 给这个数据添加一个留言的数据
								} else if(message.types === '3') {
									arr[index].message = '[位置]' // 给这个数据添加一个留言的数据
								}
								this.infoData.push(arr[index]) // 将请求到的好友申请数据加入到数组中
							} else if (userInfo.status === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
									title: '服务器出错！',
									duration: 1250
								});
							}
						}
					})
			},
			// 获取好友未读消息数
			async	getFriendUnreadMsgNum(arr, index) {
				await	uni.request({
						url: this.serverUrl + '/user/getFriendUnreadMsgNum',
						data: {
							uid: arr[index].friendId,
							fid: this.userInfo.id,
							token: this.userInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userInfo = data.data // 获取到的后端返回的具体数据
							if(userInfo.status === 200) {
								const message = userInfo.result // 最终的数据
								arr[index].infoNum = message // 给这个数据添加一个未读消息数
								this.infoData.splice(index, 0) // 更新数据
							} else if (userInfo.status === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
									title: '服务器出错！',
									duration: 1250
								});
							}
						}
					})
			},
			// 获取首页群消息的函数
			getGroupInfo() {
				uni.request({
					url: this.serverUrl + '/user/getGrouprList',
					data: {
						uid: this.userInfo.id,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userInfo = data.data // 获取到的后端返回的具体数据
						if(userInfo.status === 200) {
							const applyData = userInfo.result // 最终的数据
							if(applyData.length > 0) {
								for(let i = 0; i < applyData.length; i++) {
									this.infoData.push(applyData[i]);
								}
								this.infoData =	myHooks.sortTime(this.infoData, 'lastTime',0);
							}
						} else if (userInfo.status === 500) {
							// 提示框
							uni.showToast({
								icon: 'error',
							  title: '服务器出错！',
							  duration: 1250
							});
						}
					}
				})
			},
			// 点击搜索按钮触发的事件
			handleSearch() {
				// 路由跳转
				uni.navigateTo({
				  url: '../Search/Search'
				});
			},
			// 点击消息列表跳到聊天室
			handleChatroom(item) {
				// 发送请求，将好友消已读
				uni.request({
					url: this.serverUrl + '/user/updateFriendMsgState',
					data: {
						uid: item.friendId,
						fid: this.userInfo.id,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						if(data.data.status === 200) {
							console.log(1)
							// 路由跳转
							uni.navigateTo({
							  url: '../Chatroom/Chatroom?id=' + item.friendId + "&image=" + item.image + "&userName=" + item.userName + "&flag=true"
							});
						} else if (userInfo.status === 500) {
							// 提示框
							uni.showToast({
								icon: 'error',
							  title: '服务器出错！',
							  duration: 1250
							});
						}
					}
				})
			},
			// socket 模块
			// 用户登录 socket 注册
			join(uid) {
				// 发送一个 socket 语句给后端，当前语句的名为 login，传递的参数是 uid
				this.socket.emit('login', uid)
			},
			// socket 接收好友的消息
			receiveMsgSocket() {
				this.socket.on('friendmsg', (message, fromId) => {
					let nowMessage = '' // 现在接收的数消息
					
					if(message.types === '0') {
						// 接收的是文字消息
						nowMessage = message.message
					} else if(message.types === '1') {
						// 接收的是图片消息
						nowMessage = '[图片]'
					} else if(message.types === '2') {
						// 接收的是语音消息
						nowMessage = '[语音]'
					} else if(message.types === '3') {
						// 接收的是定位消息
						nowMessage = '[位置]'
					}
					
					for(let i = 0; i < this.infoData.length; i++) {
						if(this.infoData[i].friendId === fromId) {
							const e = this.infoData[i]
							e.message = nowMessage
							e.lastTime = new Date()
							e.infoNum++ // 消息数 +1
							
							// 先删除原来的数据项
							this.infoData.splice(i, 1)
							// 将新消息插入到最顶部
							this.infoData.unshift(e)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
// 导入公共样式
@import '../../commons/css/mycss.scss';

// 整个区域的页面样式
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-bottom: 20rpx;
	
	// 头部样式
	.top-bar {
		background-color: #fff;
		border-bottom: 2rpx solid $uni-border-color;
	}
	
	// 好友列表区域
	.friends {
		width: 100%;
		padding: 0 $uni-spacing-row-base;
		
		// 没有好友的时候，显示的样式
		.refresh {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: column;
			width: 275rpx;
			height: 580rpx;
			margin: 0 auto;
			margin-top: 50%;
			transform: translateY(-160rpx);
			text-align: center;
			
			.ref-title {
				line-height: 40rpx;
				font-size: $uni-font-size-base;
				color: rgba(39, 40, 50, 0.4);
			}
			
			.ref-bg {
				width: 230rpx;
				height: 360rpx;
			}
			
			.btn {
				width: 240rpx;
				height: 96rpx;
				background-color: $uni-color-primary;
				box-shadow: 0 52rpx 36rpx -32rpx rgba(255, 228, 49, 0.4);
				border-radius: 48rpx;
				line-height: 96rpx;
				color: $uni-text-color;
			}
		}
		
		// 好友申请和自己的好友的列表
		.friend-apply, .friend-list {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			width: 100%;
			height: 140rpx;
			
			&:active {
				background: #F3F3F3;
			}
			
			// 好友申请头像
			.apply-area {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 96rpx;
				height: 96rpx;
				text-align: center;
				background-color: #FFE431;
				border-radius: 12px;
				
				.apply-image {
					width: 48rpx;
					height: 48rpx;
					border-radius: 0;
					margin: 0;
				}
			}
			
			// 好友列表左侧头像
			.friend-list-left {
				position: relative;
				width: 96rpx;
				height: 96rpx;
				
				image {
					width: 100%;
					height: 100%;
					border-radius: 12px;
				}
				
				// 消息数
				.tips {
					position: absolute;
					top: -8rpx;
					right: -8rpx;
					display: inline-block;
					text-align: center;
					min-width: 40rpx;
					height:40rpx;
					background: $uni-color-error;
					border-radius: $uni-border-radius-circle;
					font-family: PingFangSC-Regular;
					font-size: 12rpx;
					color: $uni-text-color-inverse;
					line-height: 40rpx;
					letter-spacing: -0.41px;
				}
			}
		}
		
		// 好友列表右侧信息区域
		.friend-list-right {
			width: 575rpx;
			
			// 上部
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50rpx;
				margin-bottom: 10rpx;
				
				// 用户名
				.name {
					float: left;
					font-family: PingFangSC-Regular;
					font-size: 36rpx;
					color: $uni-text-color;
					letter-spacing: -0.62px;
				}
				
				// 消息发送时间
				.time {
					float: right;
					font-family: PingFangSC-Regular;
					font-size: 12px;
					color: rgba(39,40,50,0.40);
					letter-spacing: -0.41px;
				}
			}
			
			// 下部消息
			.bottom {
				max-width: 542rpx;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: rgba(39,40,50,0.60);
				letter-spacing: -0.48px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
