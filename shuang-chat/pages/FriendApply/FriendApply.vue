<template>
	<view class="content">
		<!-- 头部区域 -->
		<view class="top-bar">
			<!-- 左侧返回区域 -->
			<view class="top-bar-left" @tap="backHome"><image src="../../static/common/back.png"></image></view>
			<!-- 中间标题 -->
			<view class="top-bar-center">好友请求</view>
			<!-- 右侧按钮 -->
			<view class="top-bar-right"></view>
		</view>
		
		<!-- 主体区域 -->
		<view class="main">
			<view class="applyer" v-for="(item, index) in friendApplyData" :key="item.friendId">
				<!-- 顶部区域 -->
				<view class="apply-top">
					<view class="reject btn" @tap="rejectApply(item.friendId, index)">拒绝</view>
					<image :src="item.image"></image>
					<view class="agree btn" @tap="agreeApply(item.friendId, index)">同意</view>
				</view>
				
				<!-- 中间信息区域 -->
				<view class="apply-center">
					<view class="name">{{ item.userName }}</view>
					<view class="time">{{ item.lastTime | changeTime }}</view>
				</view>
				
				<!-- 留言 -->
				<view class="notic">
					<text>留言：{{ item.message }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入测试数据
	import datas from '@/commons/js/testData.js';
	
	// 导入我封装的功能函数
	import myHooks from '@/commons/js/hooks.js';
	
	export default {
		data() {
			return {
				// 用户登录的数据
				userInfo: {
					id: '',
					token: ''
				},
				friendApplyData: [] // 好友申请数据
			}
		},
		filters:{
			// 处理时间函数
			changeTime(date) {
				return myHooks.formatTime(date)
			}
		},
		onLoad() {
			this.getUserInfo();
			this.friendApply();
		},
		methods: {
			// 获取本地用户登录的数据
			getUserInfo() {
				try {
				  const value = uni.getStorageSync('shuangChat-user');
				  if (value) {
						// 如果有本地数据，就获取数据
				    this.userInfo.id = value.id
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
			// 返回上一层页面
			backHome() {
				uni.navigateBack({
					delta: 1
				});
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
								for(let i = 0; i < applyData.length; i++) {
									this.getLeaveMessage(applyData, i)
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
			// 获取好友申请的留言
			getLeaveMessage(arr, index) {
				uni.request({
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
							arr[index].message = message.message // 给这个数据添加一个留言的数据
							this.friendApplyData.push(arr[index]) // 将请求到的好友申请数据加入到数组中
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
			// 拒绝好友申请
			rejectApply(fid, index) {
				uni.showModal({
					title: '提示',
					content: '确认拒绝该申请吗？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/rejectOrDelete',
								data: {
									uid: this.userInfo.id,
									fid: fid,
									token: this.userInfo.token
								},
								method: 'POST',
								// 成功的回调
								success: (data) => {
									const userInfo = data.data // 获取到的后端返回的具体数据
									if(userInfo.status === 200) {
										this.friendApplyData.splice(index, 1)
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
						}
					}
				});
			},
			// 同意好友申请
			agreeApply(fid, index) {
				uni.showModal({
					title: '提示',
					content: '同意该好友申请吗？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/agreeApply',
								data: {
									uid: this.userInfo.id,
									fid: fid,
									token: this.userInfo.token
								},
								method: 'POST',
								// 成功的回调
								success: (data) => {
									const userInfo = data.data // 获取到的后端返回的具体数据
									if(userInfo.status === 200) {
										this.friendApplyData.splice(index, 1)
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
						}
					}
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
		justify-content: space-between;
		align-items: center;
		height: 88rpx;		
		padding-top: var(--status-bar-height); /* 解决遮盖手机的功能栏区域 */
		border-bottom: 2rpx solid $uni-border-color;
		background-color: #fff;
		z-index: 1;

		.top-bar-left {
			padding-left: 24rpx;
			z-index: 2;
			image {
				width: 32rpx;
				height: 48rpx;
			}
		}

		.top-bar-center {
			width: 200rpx;
			height: 100%;
			text-align: center;
			line-height: 86rpx;
			font-size: 40rpx;
		}
		
		.top-bar-right {
			width: 56rpx;
			height: 56rpx;
		}
	}

	// 主体区域
	.main {
		padding: 15rpx 32rpx;
		.applyer {
			margin-top: 112rpx;
			padding: $uni-spacing-col-base;
			background-color: #fff;
			box-shadow: 0 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.15);
			border-radius: $uni-border-radius-base;
			
			// 顶部样式
			.apply-top {
				display: flex;
				justify-content: space-around;
				text-align: center;
				
				// 头像样式
				image {
					width: 144rpx;
					height: 144rpx;
					margin-top: -72rpx;
					border-radius: $uni-border-radius-circle; 
				}
				
				// 按钮共同样式
				.btn {
					width: 160rpx;
					height: 64rpx;
					line-height: 64rpx;
					border-radius: 40rpx;
					font-size: 32rpx;
					letter-spacing: 3rpx;
				}
				
				// 拒绝按钮样式
				.reject {
					background-color: rgba(255, 93, 91, 0.1);
					color: rgba(255, 93, 91, 1);
				}
				
				// 同意按钮样式
				.agree {
					background-color: rgba(13, 112, 255, 1);
					color: rgba(255, 255, 255, 1);
				}
			}
		
			// 中间信息区域
			.apply-center {
				padding-top: 24rpx;
				padding-bottom: 36rpx;
				text-align: center;
				
				.name {
					font-size: 36rpx;
					font-weight: 700;
					color: $uni-text-color;
					line-height: 50rpx;
				}
				
				.time {
					font-size: $uni-font-size-sm;
					color: $uni-text-color;
					line-height: 40rpx;
				}
			}
		
			// 留言区域
			.notic {
				padding: 20rpx 32rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-bg-color-grey;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				line-height: 40rpx;
			}
		}
	}
}
</style>
