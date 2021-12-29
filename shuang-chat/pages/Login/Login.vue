<template>
	<!-- 主页面页面组件 -->
	<view class="content">
		<!-- 顶部导航区域 -->
		<view class="top-bar">
			<!-- 顶部导航右侧区域 -->
			<view class="top-bar-right" @tap="toRegister">
				  <!-- 注册按钮 -->
					<view class="register">注册</view>
			</view>
		</view>
		
		<!-- 中间 logo 区域 -->
		<view class="logo">
			<image src="../../static/common/my_logo.png"></image>
		</view>
		
		<!-- 中间主题区域 -->
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到 shuangChat！</view>
			<!-- 表单输入框 -->
			<view class="inputs">
				<input type="text" v-model="userData" placeholder=" 用户名/邮箱" placeholder-style="color: #999; font-weight: 400" />
				<input type="password" v-model="password" placeholder=" 密码" />
			</view>
			<!-- 提示语 -->
			<view class="tips" v-show="noneTip">请输入用户名/邮箱和密码！</view>
			<view class="tips" v-show="errorTip">用户名或密码错误！</view>
		</view>
		
		<!-- 按钮 -->
		<view class="submit" @click="handleLogin">登录</view>
	</view>
</template>

<script>	
	export default {
		data() {
			return {
				userData: '', // 用户名/邮箱
				password: '', // 密码
				noneTip: false, // 控制没有输入表单的提示语句
				errorTip: false, // 控制提交表单错误的提示语句
				token: '',
			}
		},
		onLoad(e) {
			// 页面加载的时候，判断路由后面是否有用户名参数，有的话直接加给输入框
			if(e.userData) {
				this.userData = e.userData
				// 注册成功提示框
				uni.showToast({
					icon: 'success',
				  title: '注册成功请登录~', 
				  duration: 1250
				});
			} else if(e.userEmail) {
				this.userData = e.userEmail
				// 注册成功提示框
				uni.showToast({
					icon: 'error',
				  title: '登录已过期！',
				  duration: 1250
				});
			}
		},
		methods: {
			// 跳转到注册页面
			toRegister() {
				uni.navigateTo({
				  url: '../Register/Register'
				});
			},
			// 登录按钮事件
			handleLogin() {
				this.noneTip = false
				this.errorTip = false
				// 1、校验表单
				if(this.userData && this.password) {
					this.noneTip = false // 隐藏没有输入表单的提示语句
					// 登录请求
					uni.request({
						url: this.serverUrl + '/login',
						data: {
							data: this.userData,
							password: this.password
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userInfo = data.data // 获取到的后端返回的具体数据
							if(userInfo.status === 200) {
								// 登陆成功
								// 1、存储用户信息到本地
								try {
								  uni.setStorageSync('shuangChat-user', {
										'id': userInfo.result.id,
										'userName': userInfo.result.userName,
										'userEmail': userInfo.result.userEmail,
										'image': userInfo.result.image,
										'token': userInfo.result.token
									});
								} catch (e) {
								  console.log(e)
								}
								// 2、路由跳转到首页
								uni.navigateTo({
								  url: '../index/index'
								});
							} else if (userInfo.status === 400) {
								// 用户匹配失败
								// 提示框
								uni.showToast({
									icon: 'error',
								  title: '用户名或密码错误',
								  duration: 1250
								});
								this.password = ''
								this.errorTip = true
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
				} else {
					this.noneTip = true // 显示没有输入表单的提示语句
				}
			},
		}
	}
</script>

<style lang="scss">
// 整个区域的页面样式
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-bottom: 20rpx;
	margin-top: var(--status-bar-height);
	
	// 当行顶部区域样式
	.top-bar {
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: $uni-bg-color;
		box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
		z-index: 1;
		text-align: right;
		
		// 顶部导航右侧区域
		.top-bar-right {
			.register {
				float: right;
				width: 36px;
				height: 25px;
				margin-right: 32rpx;
				font-family: PingFangSC-Medium;
				font-size: 18px;
				color: #333333;
				letter-spacing: 0;
				font-weight: 700;
			}
		}
	}

	// 中间 logo 区域
	.logo {
		margin-top: 60rpx;
		text-align: center;
		
		image {
			width: 192rpx;
			height: 192rpx;
		}
	}
	
	// 主体区域
	.main {
		width: 100%;
		box-sizing: border-box;
		margin-top: 48rpx;
		padding: 0 32rpx;
		
		// 标题
		.title {
			width: 112rpx;
			height: 80rpx;
			font-family: PingFangSC-Medium;
			font-size: 56rpx;
			color: #272832;
			letter-spacing: 0;
			font-weight: 700;
		}
		
		// 标语
		.slogan {
			width: 100%;
			height: 56rpx;
			margin-top: 16rpx;
			font-family: PingFangSC-Regular;
			font-size: 36rpx;
			color: rgba(39,40,50,0.50);
			letter-spacing: 0;
			font-weight: 400;
		}
		
		// 表单输入看
		.inputs {
			margin-top: 32rpx;
			
			input {
				width: 100%;
				height: 90rpx;
				margin-top: 36rpx;
				border-bottom: 2rpx solid $uni-border-color;
				font-family: AvenirNext-Medium;
				font-size: 18px;
				color: #000;
				letter-spacing: 0;
				font-weight: 500;
			}
		}
		
		// 提示框
		.tips {
			position: absolute;
			float: left;
			margin-top: 16rpx;
			font-family: AvenirNext-Medium;
			font-size: 30rpx;
			color: $uni-color-warning;
			letter-spacing: 0;
			font-weight: 700;
		}
	}
	
	// 登录按钮
	.submit {
		width: 520rpx;
		height: 96rpx;
		margin: 0 auto;
		margin-top: 124rpx;
		line-height: 96rpx;
		background: #FFE431;
		box-shadow: 0px 5px 17px 13px rgba(255,228,49,0.4);
		border-radius: 48rpx;
		text-align: center;
		font-family: PingFangSC-Medium;
		font-size: 38rpx;
		color: #272832;
		letter-spacing: 0;
		font-weight: 700;
	}
}
</style>
