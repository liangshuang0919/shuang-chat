<template>
	<!-- 主页面页面组件 -->
	<view class="content">
		<!-- 顶部导航区域 -->
		<view class="top-bar">
			<!-- 顶部导航左侧区域 -->
			<view class="top-bar-left" @tap="toLogin">
				  <!-- 返回登录 -->
					<image class="back-img" src="../../static/common/back.png"></image>
			</view>
		</view>
		
		<!-- 中间 logo 区域 -->
		<view class="logo">
			<image src="../../static/common/my_logo.png"></image>
		</view>
		
		<!-- 中间主题区域 -->
		<view class="main">
			<view class="title">注册</view>
			<!-- 表单输入框 -->
			<view class="inputs">
				<view class="inputs-div">
					<input class="username" type="text" placeholder=" 请输入昵称" placeholder-style="color: #999; font-weight: 400" @blur="matchUserName" />
					<!-- 正确的提示 -->
					<image src="../../static/sign/right1.png" v-if="isUserName"></image>
					<!-- 昵称重复的提示语句 -->
					<view v-if="userNameHad">该昵称已存在</view>
				</view>
				<view class="inputs-div">
					<input class="email" type="text" placeholder=" 请输入邮箱" placeholder-style="color: #999; font-weight: 400" @blur="matchEmail" />
					<!-- 正确的提示 -->
					<image src="../../static/sign/right1.png" v-if="isEmail"></image>
					<!-- 昵称重复的提示语句 -->
					<view v-if="emailHad">该邮箱已存在</view>
					<!-- 邮箱无效的提示语句 -->
					<view v-if="isInvalid">邮箱格式错误</view>
				</view>
				<view class="inputs-div">
					<input class="psw" :type="inputType" placeholder=" 请输入密码" @input="matchPsw" />
					<view class="looks" @tap="changeShowPws">
						<!-- 显示、隐藏密码 -->
						<image :src="isPsw ? closeLook : openLook"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 按钮 -->
		<view :class="[{ submit: isShow }, {unSubmit: !isShow }]" @tap="handleRegister">注册</view>
	</view>
</template>

<script>	
	export default {
		data() {
			return {
				inputType: 'password',	// 密码框的类型
				userNameHad: false, // 用户名是否已经存在 
				isUserName: false, // 用户名是否正确的提示图标
				emailHad: false, // 邮箱是否已经存在
				isInvalid: false, // 邮箱格式错误
				isEmail: false, // 邮箱是否正确的提示图标
				openLook: '../../static/sign/look.png', // 闭着眼睛的图片
				closeLook: '../../static/sign/biyan.png', // 闭着眼睛的图片
				isPsw: true, // 密码开启、隐藏的提示图标
				userName: '', // 用户名
				userEmail: '', // 邮箱
				password: '', // 密码
				isShow: false // 控制注册按钮的样式
			}
		},
		methods: {
			// 跳转到登录页面（返回上一层路由）
			toLogin() {
				uni.navigateBack({
				  delta: 1
				});
			},
			// 校验用户名
			matchUserName(e) {
				this.userName = e.detail.value
				// 如果用户名不为空，发送请求校验，该用户名是否存在
				if(this.userName.length > 0) {
					uni.request({
						url: this.serverUrl + '/register/judge',
						data: {
							data: this.userName,
							type: 'userName'
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							if(data.statusCode === 200) {
								const res = data.data.result
								// result > 0 表示用户名存在
								if(res > 0) {
									this.userNameHad = true
									this.isUserName = false
								} else {
									// result = 0 不存在，可以注册
									this.userNameHad = false
									this.isUserName = true
								}
							} else if (data.statusCode === 500) {
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
					this.userNameHad = false
					this.isUserName = false
					this.isShow = false
				}
				this.isOk()
			},
			// 验证邮箱
			matchEmail(e) {
				this.userEmail = e.detail.value; // 获取输入邮箱中的内容
				const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/; // 邮箱校验
				// 判断是否输入了邮箱
				if(this.userEmail.length > 0) {
					// 判断邮箱是否输入正确
					if(reg.test(this.userEmail)) {
						this.isInvalid = false
						this.isEmail = true
						// 调用匹配邮箱的请求
						this.requestEmail()
					} else {
						this.isEmail = false
						this.emailHad = false
						this.isInvalid = true
					}
				} else {
					this.isEmail = false
					this.emailHad = false
					this.isInvalid = false
					this.isShow = false
				}
				this.isOk()
			},
			// 发送匹配邮箱请求
			requestEmail() {
				// 如果用户名不为空，发送请求校验，该用户名是否存在
				if(this.userEmail.length > 0) {
					uni.request({
						url: this.serverUrl + '/register/judge',
						data: {
							data: this.userEmail,
							type: 'userEmail'
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							if(data.statusCode === 200) {
								const res = data.data.result
								// result > 0 表示用户名存在
								if(res > 0) {
									this.emailHad = true
									this.isEmail = false
								} else {
									// result = 0 不存在，可以注册
									this.emailHad = false
									this.isEmail = true
								}
							} else if (data.statusCode === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
								  title: '服务器出错！',
								  duration: 1250
								});
							}
						}
					})
				}
			},
			// 校验密码
			matchPsw(e) {
				this.password = e.detail.value
				this.isOk()
			},
			// 判断用户名、邮箱、密码是否都输入了
			isOk() {
				if(this.isUserName & this.isEmail & this.password.length > 5) {
					this.isShow = true
				}
			},
			// 改变密码是否显示隐藏
			changeShowPws() {
				this.isPsw = !this.isPsw
				this.inputType = this.isPsw ? 'password' : 'text'
			},
			// 注册用户按钮事件
			handleRegister() {
				// 当表单全部输入了，韭菜可以发送注册请求
				if(this.isShow) {
					uni.request({
						url: this.serverUrl + '/register/add',
						data: {
							userName: this.userName,
							userEmail: this.userEmail,
							password: this.password
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							if(data.statusCode === 200) {
								// 注册成功跳转到登录页面
								uni.navigateTo({
								    url: '../Login/Login?userData=' + this.userEmail
								});
							} else if (data.statusCode === 500) {
								// 提示框
								uni.showToast({
									icon: 'error',
								  title: '服务器出错！',
								  duration: 1250
								});
							}
						}
					})
				}
			}
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
	margin-top: var(--status-bar-height); // 解决遮盖手机的功能栏区域
	
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
		
		// 顶部导航右侧区域
		.top-bar-left {
			float: left;
			width: 88rpx;
			height: 88rpx;
			padding-left: 32rpx;
			
			.back-img {
				width: 26rpx;
				height: 46rpx;
				margin-top: 21rpx;
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
		
		// 表单输入框
		.inputs {
			margin-top: 32rpx;
			
			.inputs-div {
				position: relative;
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
				
				view {
					position: absolute;
					top: 28rpx;
					right: 0;
					color: $uni-color-warning;
					font-weight: 600;
				}
				
				image {
					position: absolute;
					top: 28rpx;
					right: 0;
					width: 42rpx;
					height: 32rpx;
				}
				
				// 控制密码显示隐藏的图标
				.looks {
					image {
						top: 6rpx;
					}
				}
			}			
		}
	}
	
	// 注册按钮注册样式
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
	
	// 注册按钮未注册样式
	.unSubmit {
		width: 520rpx;
		height: 96rpx;
		margin: 0 auto;
		margin-top: 124rpx;
		line-height: 96rpx;
		background: rgba(39, 40, 50, 0.2);
		border-radius: 48rpx;
		text-align: center;
		font-family: PingFangSC-Medium;
		font-size: 38rpx;
		color: $uni-text-color-inverse;
		letter-spacing: 0;
		font-weight: 700;
	}
}
</style>
