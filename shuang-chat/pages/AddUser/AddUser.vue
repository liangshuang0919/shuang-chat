<template>
	<view class="content">
		<!-- 头部区域 -->
		<view class="top-bar">
			<!-- 左侧返回区域 -->
			<view class="top-bar-left" @click="backHome"><image src="../../static/common/back.png"></image></view>
			<!-- 右侧按钮 -->
			<navigator :url="'../UserInfo/UserInfo?id=' + userId + '&flag=' + userFlag">
				<view class="top-bar-right">
					<image src="../../static/userhome/more.png"></image>
				</view>
			</navigator>
		</view>

		<!-- 页面的大背景 -->
		<view class="bg" id="bg">
			<!-- 遮罩层 -->
			<view class="mask" :animation="animationData5"></view>
			<!-- 背景图片 -->
			<image :src="userInfo.image" mode="aspectFill"></image>
		</view>

		<!-- 主体区域 -->
		<view class="main">
			<!-- 头部区域 -->
			<view class="main-header">
				<!-- 性别图标 -->
				<view v-if="userInfo.sex === 1"class="sex" :style="{ background: sexBg2 }" :animation="animationData4">
					<image src="../../static/userhome/female.png"></image>
				</view>
				<view v-else class="sex" :style="{ background: sexBg1 }" :animation="animationData4">
					<image src="../../static/userhome/male.png"></image>
				</view>
				<!-- 头像 -->
				<image class="user-image" id="image" :src="userInfo.image" mode="aspectFill" :animation="animationData3"></image>
			</view>

			<!-- 用户信息区域 -->
			<view class="user-info">
				<!-- 用户名 -->
				<view class="user-name">{{ userInfo.userName }}</view>
				<!-- 用户昵称 -->
				<view class="user-nick" v-if="userFlag === 'true'">备注：{{ nickName }}</view>
				<!-- 用户签名 -->
				<view class="user-sign">{{ userInfo.introduction }}</view>
			</view>

			<!-- 底部按钮 -->
			<view v-if="userFlag !== '2'" class="bottom-area">
				<view v-if="userFlag === 'true'" class="send" @tap="sendMsg">发送消息</view>
				<view v-else class="add" @tap="addFriendApply">添加好友</view>
			</view>
		</view>
		
		<!-- 用户好友申请页面 -->
		<!-- 申请信息 -->
		<view class="add-misg" :style="{ height: elementHeight + 'px', bottom: '-' + elementHeight + 'px' }" :animation="animationData1">
			<view class="name">{{ userInfo.userName }}</view>
			<textarea class="add-main" v-model="applyMsg" maxlength="120" />
		</view>
		
		<!-- 按钮区域 -->
		<view class="add-btn" :animation="animationData2">
			<view class="cancel-btn" @tap="addFriendApply">取消</view>
			<view class="submit-btn" @tap="friendApply">发送请求</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexBg1: 'rgba(29, 101, 255, 1)', // 男
			sexBg2: 'rgba(255, 93, 91, 1)', // 女
			// 当前登录的用户的一个信息
			userLocalInfo: {
				id: '',
				userName: '',
				token: ''
			},
			// 打开的用户详情的用户信息
			userInfo: {
				userName: '',
				sex: '',
				introduction: '', // 个性签名
				image: ''
			},
			nickName: '', // 好友备注
			applyMsg: '', // 申请好友时的申请内容
			elementHeight: '', // 存储节点当前的高度
			animationData1: {}, // 进行设置申请好友的输入框动画的对象
			animationData2: {}, // 进行设置申请好友的按钮动画的对象
			animationData3: {}, // 进行设置申请好友时头像动画的对象
			animationData4: {}, // 进行设置申请好友时性别图标动画的对象
			animationData5: {}, // 进行设置申请好友时背景颜色发生改变动画的对象
			isAdd: false, // 控制动画开启和关闭
			userImageWidth: 0, // 获取用户头像的宽度
			userId: '', // url 地址中的好友 id
			userFlag: '' // 判断当前用户与主人的关系
		};
	},
	onReady() {
		this.getElementStyle()
	},
	onLoad(e) {
		this.getLocalUserInfo() // 获取本地数据
		this.userId = e.id
		this.userFlag = e.flag
		this.getUserInfo() // 发送请求获取用户数据
		if(this.userFlag === 'true') {
			this.getNickName() // 获取好友昵称
		}
	},
	onShow() {
		this.getUserInfo()
	},
	methods: {
		// 获取本地用户登录的数据
		getLocalUserInfo() {
			try {
			  const value = uni.getStorageSync('shuangChat-user');
			  if (value) {
					// 如果有本地数据，就获取数据
			    this.userLocalInfo.id = value.id
					this.userLocalInfo.userName = value.userName
					this.userLocalInfo.token = value.token
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
		// 发送请求获取当前用户信息
		async	getUserInfo() {
			await	uni.request({
					url: this.serverUrl + '/user/info',
					data: {
						id: this.userId,
						token: this.userLocalInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userData = data.data
						
						// 如果请求成功
						if(userData.status === 200) {
							Object.keys(this.userInfo).forEach(key => { 
								this.userInfo[key] = userData.result[key]
							})
						}
					}
				})
		},
		// 返回登录页面
		backHome() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 动态获取页面节点的高度
		getElementStyle() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#bg').boundingClientRect(data => {
				this.elementHeight = data.height - 186; 
			}).exec();
			query.select('#image').boundingClientRect(data => {
				this.userImageWidth = data.width - 6
			}).exec();
		},
		// 添加好友按钮的页面动画
		addFriendApply() {
			this.isAdd = !this.isAdd
			this.applyMsg = this.userLocalInfo.userName + '，请求添加好友~'
			// 添加动画
			// 第一个动画添加给申请好友的输入框区域
			const animation1 = uni.createAnimation({
				duration: 750,
					timingFunction: 'ease',
			})
			// 第二个动画添加给申请好友的按钮区域
			const animation2 = uni.createAnimation({
				duration: 750,
					timingFunction: 'ease',
			})
			// 第三个动画添加给申请好友时头像的变化
			const animation3 = uni.createAnimation({
				duration: 750,
					timingFunction: 'ease',
			})
			// 第四个动画添加给申请好友时性别图标的变化
			const animation4 = uni.createAnimation({
				duration: 750,
					timingFunction: 'ease',
			})
			// 第无个动画添加给申请好友时背景颜色的变化
			const animation5 = uni.createAnimation({
				duration: 750,
					timingFunction: 'ease',
			})
			if(this.isAdd) {
				animation1.bottom(0).step()
				animation2.bottom(30).step()
				animation3.width(120).height(120).top(30).left(120).step()
				animation4.opacity(0).step()
				animation5.backgroundColor('rgba(13,112,255,0.8)').step()
			} else {
				animation1.bottom(-this.elementHeight).step()
				animation2.bottom(-100).step()
				animation3.width(this.userImageWidth).height(this.userImageWidth).top(0).left(0).step()
				animation4.opacity(1).step()
				animation5.backgroundColor('rgba(13,112,255,0)').step()
			}
			
			this.animationData1 = animation1.export()
			this.animationData2 = animation2.export()
			this.animationData3 = animation3.export()
			this.animationData4 = animation4.export()
			this.animationData5 = animation5.export()
		},
		// 发送添加好友请求
		friendApply() {
			this.addFriendApply() // 关闭动画
			// 发送申请好友请求
			uni.request({
				url: this.serverUrl + '/friend/apply',
				data: {
					uid: this.userLocalInfo.id,
					fid: this.userId,
					msg: this.applyMsg,
					token: this.userLocalInfo.token
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
		// 获取好友昵称
		getNickName() {
			uni.request({
				url: this.serverUrl + '/friend/getNickName',
				data: {
					uid: this.userLocalInfo.id,
					fid: this.userId,
					token: this.userLocalInfo.token
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
		// 点击发送消息按钮，跳转到一对一聊天页面
		sendMsg() {
			// 路由跳转
			uni.navigateTo({
			  url: '../Chatroom/Chatroom?id=' + this.userId + "&image=" + this.userInfo.image + "&userName=" + this.userInfo.userName + "&flag=true"
			});
		},
	}
};
</script>

<style lang="scss">
// 全局样式
.content {
	// 头部样式
	.top-bar {
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88rpx;
		border-bottom: 2rpx solid $uni-border-color;
		padding-top: var(--status-bar-height);
		background-color: rgba(255, 255, 255, 0);
		z-index: 1;

		.top-bar-left {
			padding-left: 24rpx;
			z-index: 2;
			image {
				width: 32rpx;
				height: 48rpx;
			}
		}

		.top-bar-right {
			padding-right: 24rpx;
			height: 100%;
			line-height: 72rpx;
			z-index: 2;

			image {
				width: 52rpx;
				height: 12rpx;
			}
		}
	}

	// 背景区域样式
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		// 遮罩层
		.mask {
			width: 100%;
			height: 100%;
			// background-color: red;
		}

		// 背景图
		image {
			position: absolute;
			left: -30rpx;
			top: -30rpx;
			width: 110%;
			height: 110%;
			filter: blur(24rpx);
			opacity: 0.6;
			z-index: -1;
		}
	}

	// 主体区域
	.main {
		padding-top: 100rpx;
		text-align: center;

		// 头部区域
		.main-header {
			position: relative;
			width: 312rpx;
			height: 312rpx;
			margin: 0 auto;
			// 性别图标
			.sex {
				position: absolute;
				bottom: 12rpx;
				right: 12rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius: $uni-border-radius-circle;
				z-index: 2;

				image {
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			// 用户头像
			.user-image {
				top: 0;
				left: 0;
				width: 300rpx;
				height: 300rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
				border-radius: 48rpx;
				box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, 0.1);
				z-index: 1;
			}
		}

		// 主体区域
		.user-info {
			padding-top: 42rpx;
			font-family: PingFangSC-Regular;
			// 用户名
			.user-name {
				line-height: 74rpx;
				font-size: 52rpx;
				color: $uni-text-color;
			}

			// 用户昵称
			.user-nick {
				line-height: 48rpx;
				font-size: $uni-font-size-base;
			}

			// 用户签名
			.user-sign {
				padding: 20rpx 100rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				line-height: 48rpx;
				font-weight: 200;
			}
		}
	}

	// 底部区域
	.bottom-area {
		position: fixed;
		bottom: 60rpx;
		width: 100%;
		margin: 0 auto;
		
		.send {
			width: 684rpx;
			height: 80rpx;
			margin: 0 auto;
			background: rgba(0, 0, 0, 0.5);
			border-radius: $uni-border-radius-sm;
			font-size: $uni-font-size-lg;
			line-height: 80rpx;
			letter-spacing: 6rpx;
			color: #fff;
		}
		
		.add {
			width: 684rpx;
			height: 80rpx;
			margin: 0 auto;
			background: #0d70ff;
			border-radius: $uni-border-radius-sm;
			font-size: $uni-font-size-lg;
			line-height: 80rpx;
			letter-spacing: 6rpx;
			color: #fff;
		}
	}

	// 申请好友区域的样式
	.add-misg {
		position: fixed;
		box-sizing: border-box;
		width: 100%;
		padding: 0 56rpx;
		background-color: rgba(255, 255, 255, 1);
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		
		.name {
			padding: 168rpx 0 40rpx;
			line-height: 74rpx;
			font-size: 52rpx;
			color: $uni-text-color;
		}
		
		// 输入框样式
		.add-main {
			width: 100%;
			height: 420rpx;
			padding: 18rpx 0;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
			text-indent: 2em;
		}
	}

	// 申请好友按钮区域
	.add-btn {
		position: fixed;
		bottom: -104rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 80rpx;
		margin: 0 auto;
		padding: 12rpx;
		text-align: center;
		z-index: 1;
		
		.cancel-btn {
			width: 120rpx;
			height: 80rpx;
			margin: 0 auto;
			background: $uni-bg-color-hover;
			border-radius: $uni-border-radius-sm;
			font-size: $uni-font-size-lg;
			line-height: 80rpx;
			letter-spacing: 6rpx;
		}
		
		.submit-btn {
			width: 580rpx;
			height: 80rpx;
			margin: 0 auto;
			background: #0d70ff;
			border-radius: $uni-border-radius-sm;
			font-size: $uni-font-size-lg;
			line-height: 80rpx;
			letter-spacing: 6rpx;
			color: #fff;
		}
	}
}
</style>
