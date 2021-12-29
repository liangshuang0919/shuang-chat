<template>
	<view class="content">
		<!-- 头部区域 -->
		<view class="top-bar">
			<!-- 搜索框区域 -->
			<view class="search-input">
				<input type="search" class="search" placeholder=" 搜索用户名/群" placeholder-style="color: #999; font-weight: 400" @input="search" />
				<!-- 搜索的图标 -->
				<image src="../../static/search/search.png" mode=""></image>
			</view>
			<!-- 右侧取消按钮区域 -->
			<view class="top-bar-right">
				<navigator url="../index/index">
					<view class="text">取消</view>
				</navigator>
			</view>
		</view>
		
		<!-- 主体区域 -->
		<view class="main" v-if="userArr.length !== 0">
			<!-- 搜索到的用户区域 -->
			<view class="search-user result">
				<!-- 标题 -->
				<view class="title" >用户</view>
				<!-- 搜索到的数组区域 -->
				<view class="list user" v-for="item in userArr" :key="item.id">
					<!-- 头像 -->
					<navigator :url="'../AddUser/AddUser?id=' + item._id + '&flag=' + item.flag">
						<image :src="item.image"></image>
					</navigator>
					<!-- 用户信息 -->
					<view class="info">
						<view class="name" v-html="item.userName"></view>
						<view class="email" v-html="item.userEmail"></view>
					</view>
					<!-- 按钮 -->
					<view v-if="item.flag != 2">
						<view class="right-btn send" v-if="item.flag" @tap="sendMsg(item)">发消息</view>
						<view class="right-btn add" v-else @tap="friendApply(item._id)">加好友</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 修改数据的弹出层 -->
		<view class="modify" id="modify" :style="{ bottom: '-' + elementHeight + 'px' }" :animation="animationData1">
			<!-- 头部区域 -->
			<view class="modify-header">
				<view class="cancle" @tap="modifyCancle">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			
			<!-- 填写内容区域 -->
			<view class="modify-main"> 
				<textarea class="modify-content" v-model="modifyData" />
			</view>
		</view>
	</view>
</template>

<script>
	// 导入测试数据
	import datas from '../../commons/js/testData.js';
	
	// 导入自己封装的功能函数
	import myHooks from '@/commons/js/hooks.js';
	
	// <!-- 搜索到的群区域 -->
	// <view class="search-user result">
	// 	<!-- 标题 -->
	// 	<view class="title">群</view>
	// 	<!-- 搜索到的数组区域 -->
	// 	<view class="list user" v-for="item in userArr" :key="item.id">
	// 		<!-- 头像 -->
	// 		<navigator :url="'../AddUser/AddUser?id=' + item._id + '&flag=' + item.flag">
	// 			<image :src="item.image"></image>
	// 		</navigator>
	// 		<!-- 用户信息 -->
	// 		<view class="info">
	// 			<view class="name" v-html="item.userName"></view>
	// 			<view class="email" v-html="item.userEmail"></view>
	// 		</view>
	// 		<!-- 按钮 -->
	// 		<view v-if="item.flag != 2">
	// 			<view class="right-btn send" v-if="item.flag">发消息</view>
	// 			<view class="right-btn add" v-else @tap="groupApply">加好友</view>
	// 		</view>
	// 	</view>
	// </view>
	
	export default {
		data() {
			return {
				userArr: [], // 用来存放搜索的用户信息
				// 本地用户数据
				userInfo: {
					id: '',
					userName: '',
					userEmail: '',
					image: '',
					token: ''
				},
				modifyTitle: '', // 要修改的内容的标题
				modifyData: '', // 修改内容的文本域中的数据
				isModify: false, // 控制动画的开关
				animationData1: {}, // 进行设置申请好友的输入框动画的对象
				elementHeight: 0, // modify 弹框节点的高度
				friendId: '' // 申请好友请求时的好友 id
			}
		},
		onReady() {
			// 页面加载的时候调用获取节点样式方法
			this.getElementStyle()
		},
		onLoad() {
			this.getUserInfo() // 获取本地数据
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
						this.userInfo.userEmail = value.userEmail
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
			// 搜索框触发的事件
			handleSearch(e) {
				const searchValue = e.detail.value // 获取搜索框的数据
				// 当输入的值不为空再去搜索
				if(searchValue.length > 0) {
					this.searchUser(searchValue)
				}
			},
			// 搜索用户/群的事件（使用了防抖）
			search: myHooks.debounce(function(e) {
				this.userArr = []
				const searchValue = e.detail.value // 获取输入框中的内容
				
				// 输入框有内容
				if(searchValue.length > 0) {
					this.searchUser(searchValue)
				}
			}, 300),
			// 搜索用户的事件
			searchUser(value) {
				uni.request({
					url: this.serverUrl + '/search/user',
					data: {
						data: value,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userInfo = data.data // 获取到的后端返回的具体数据
						if(userInfo.status === 200) {
							const arr = userInfo.result // 用户列表
							for(let i = 0; i < arr.length; i++) {
								this.searchFriend(arr[i], value) // 判断当前用户是不是好友
							}
						} else if (userInfo.status === 401) {
							// 跳转到登录页
							uni.navigateTo({
							  url: '../Login/Login?userEmail=' + this.userInfo.userEmail
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
			// 判断当前用户是不是自己的好友
			searchFriend(user, value) {
				let flag = false // 作为是否为好友的标识符
				const exp = eval('/' + value + "/g") // 封装一个正则，到时候搜索的时候让文字高亮
				
				if(user._id === this.userInfo.id) {
					flag = 2 // flag 为 2 的时候，表示当前用户是自己，需要将按钮去掉
					user.flag = flag
					user.userName =	user.userName.replace(exp, "<span style='color: #4AAAFF;'>" + value + "</span>") // 高亮显示用户名
					user.userEmail = user.userEmail.replace(exp, "<span style='color: #4AAAFF;'>" + value + "</span>") // 高亮显示邮箱
					user.image = user.image
					this.userArr.push(user)
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.userInfo.id,
							fid: user._id,
							token: this.userInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userInfo = data.data // 获取到的后端返回的具体数据
							if(userInfo.status === 200) {
								// 是好友
								flag = true // 如果是好友，将 flag 置为 1
							} else if (userInfo.status === 400) {
								// 不是好友
								flag = false // 如果不是好友，将 flag 置为 0
							} else if (userInfo.status === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
								  title: '服务器出错！',
								  duration: 1250
								});
							}
							
							// 给当前用户添加数据
							user.flag = flag // 给用户设置好友标识符
							// user.id = 
							user.userName =	user.userName.replace(exp, "<span style='color: #4AAAFF;'>" + value + "</span>") // 高亮显示用户名
							user.userEmail = user.userEmail.replace(exp, "<span style='color: #4AAAFF;'>" + value + "</span>") // 高亮显示邮箱
							user.image = user.image
							this.userArr.push(user)
						}
					})
				}
			},
			// 加好友的按钮事件
			friendApply(fid) {
				this.modifyAnimation('申请好友')
				this.friendId = fid // 获取添加好友的 id
			},
			groupApply() {
				this.modifyAnimation('申请群')
			},
			// 动态获取页面节点的高度
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#modify').boundingClientRect(data => {
					this.elementHeight = data.height;
				}).exec();
			},
			// 修改项弹框动画
			modifyAnimation(title) {
				if(title) {
					this.modifyTitle = title; // 获取修改内容的标题
				}
				
				this.isModify = !this.isModify
				this.modifyData = this.userInfo.userName + '，请求添加好友~'
				// 添加动画
				const animation1 = uni.createAnimation({
					duration: 750,
					timingFunction: 'ease',
				})
				
				if(this.isModify) {
					animation1.bottom(0).step()
				} else {
					animation1.bottom(-this.elementHeight).step()
				}
				
				this.animationData1 = animation1.export()
			},
			// 申请好友的确认按钮
			modifySubmit() {
				this.modifyAnimation() // 关闭动画
				// 发送申请好友请求
				uni.request({
					url: this.serverUrl + '/friend/apply',
					data: {
						uid: this.userInfo.id,
						fid: this.friendId,
						msg: this.modifyData,
						token: this.userInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userInfo = data.data // 获取到的后端返回的具体数据
						if(userInfo.status === 200) {
							// 申请好友成功
							uni.showToast({
								icon: 'success',
							  title: '申请好友成功~',
							  duration: 1250
							});
						} else if (userInfo.status === 500) {
							// 申请好友失败
							uni.showToast({
								icon: 'success',
							  title: '申请好友失败！',
							  duration: 1250
							});
						}
					}
				})
			},
			// 取消请求好友按钮
			modifyCancle() {
				this.modifyAnimation()
			},
			// 给好友发消息的按钮事件
			sendMsg(item) {
				// 路由跳转
				uni.navigateTo({
				  url: '../Chatroom/Chatroom?id=' + item._id + "&image=" + item.image + "&userName=" + item.userName + "&flag=true"
				});
			},
		}
	}
</script>

<style lang="scss">
// 全局样式
.content {
	// 头部样式
	.top-bar {
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		border-bottom: 2rpx solid $uni-border-color;
		background-color: #fff;
		z-index: 1;
		
		.search-input {
			position: relative;
			width: 500rpx;
			
			.search {
				width: 100%;
				height: 60rpx;
				padding: 0 60rpx 0 12rpx;
				background: $uni-bg-color-grey;
			}
			
			image {
				position: absolute;
				top: 8rpx;
				right: -60rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.top-bar-right {
			.text {
				width: 70rpx;
				height: 40rpx;
				font-size: 30rpx;
				text-align: center;
				color: #272832;
				line-height: 40rpx;
				font-weight: 600;
			}
		}
	}
	
	// 主体区域样式
	.main {
		padding-top: 12rpx;
		
		// 搜索的用户区域样式	
		.search-user {
			padding: 20rpx;
			
			&:first-child {
				border-bottom: 1px solid #ddd;
			}
			
			// 标题
			.title {
				width: 86rpx;
				height: 60rpx;
				font-family: PingFangSC-Semibold;
				font-size: 40rpx;
				color: #272832;
				letter-spacing: -1.5rpx;
				font-weight: 600;
			}
			
			// 用户列表区域
			.list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 80rpx;
				padding: 20rpx 0;
				
				// 头像
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				
				// 用户信息
				.info {
					flex: 1;
					padding-left: 30rpx;
					
					.name {
						line-height: 50rpx;
						font-size: 36rpx;
						color: $uni-text-color;
					}
					
					.email {
						line-height: 28rpx;
						font-size: $uni-font-size-sm;
						color: $uni-text-color;
					}
				}
				
				// 右侧按钮
				.right-btn {
					width: 120rpx;
					height: 50rpx;
					border-radius: 24rpx;
					text-align: center;
					line-height: 50rpx;
					font-family: PingFangSC-Regular;
					font-size: 26rpx;
					letter-spacing: -0.82rpx;
				}
				
				// 发消息的样式
				.send {
					background: rgba(84, 121, 255, 1);
					color: #fff;
				}
				
				// 加好友的样式
				.add {
					background: rgba(74, 170, 255, 0.1);
					color: #4AAAFF;
				}
			}
		}
	}
	
	// 修改信息的弹框样式
	.modify {
		position: fixed;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		z-index: 10;
		
		// 头部区域
		.modify-header {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			width: 100%;
			height: 88rpx;
		  padding-top: var(--status-bar-height);
			border-bottom: 1px solid $uni-border-color;
			
			.cancle {
				padding: $uni-spacing-col-base 32rpx;
				line-height: 44rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
			}
			
			.title {
				flex: auto;
				text-align: center;
				line-height: 88rpx;
				font-size: 40rpx;
				color: $uni-text-color;
			}
			
			.define {
				padding: $uni-spacing-col-base 32rpx;
				line-height: 44rpx;
				font-size: $uni-font-size-lg;
				color: #4AAAFF;
			}
		}
	
		// 修改内容区域
		.modify-main {
			display: flex;
			flex-direction: column;
			
			.modify-content {
				width: 686rpx;
				height: 386rpx;
				margin: 0 auto;
				margin-top: 36rpx;
				padding: $uni-spacing-col-base;
				background-color: $uni-bg-color-grey;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
