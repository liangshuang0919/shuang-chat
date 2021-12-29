<template>
	<view class="content">
		<!-- 头部区域 -->
		<view class="top-bar">
			<!-- 左侧返回区域 -->
			<view class="top-bar-left" @tap="backHome"><image src="../../static/common/back.png"></image></view>
			<!-- 中间标题 -->
			<view class="top-bar-center">详情</view>
			<!-- 右侧按钮 -->
			<view class="top-bar-right"></view>
		</view>
		
		<!-- 主体区域 -->
		<view class="main">
			<!-- 第一段信息区域 -->
			<view class="main-first">
				<!-- 每一行的信息 -->
				<view class="row" @tap="modifyAnimation('昵称', userInfo.userName, false, 'userName')">
					<!-- 左侧标题 -->
					<view class="row-left">昵称</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ userInfo.userName }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row">
					<!-- 左侧标题 -->
					<view class="row-left">头像</view>
					<!-- 中间信息 -->
					<view class="row-center" v-if="userLocalInfo.id === userId">
						<!-- 图片裁剪组件 -->
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="meslist_img"></image>
					</view>
					<view class="row-center" v-else>
						<!-- 图片裁剪组件 -->
						<image :src="userInfo.image" class="meslist_img"></image>
					</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row" @tap="modifyAnimation('签名', userInfo.introduction, false, 'introduction')">
					<!-- 左侧标题 -->
					<view class="row-left">签名</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ userInfo.introduction }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row">
					<!-- 左侧标题 -->
					<view class="row-left">注册</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ userInfo.time | changeTime }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
			
			<!-- 第二段信息区域 -->
			<view class="main-second">
				<!-- 每一行的信息 -->
				<view class="row" v-if="userFlag === 'true'" @tap="modifyAnimation('备注', nickName, false, 'nickName')">
					<!-- 左侧标题 -->
					<view class="row-left">备注</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ nickName }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row">
					<!-- 左侧标题 -->
					<view class="row-left">性别</view>
					<!-- 中间信息 -->
					<view class="row-center">
						<!-- 性别选择器 -->
						<picker v-if="userLocalInfo.id === userId" @change="bindPickerChange" :value="userInfo.sex" :range="sexArray">
						  <view class="uni-input">{{ sexArray[userInfo.sex] }}</view>
						</picker>
						<view v-else class="uni-input">{{ sexArray[userInfo.sex] }}</view>
					</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row">
					<!-- 左侧标题 -->
					<view class="row-left">生日</view>
					<!-- 中间信息 -->
					<view class="row-center">
						<!-- 日期选择器 -->
						<picker v-if="userLocalInfo.id === userId" mode="date" :value="userInfo.birth" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{ userInfo.birth }}</view>
						</picker>
						<view v-else class="uni-input">{{ userInfo.birth }}</view>
					</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row" @tap="modifyAnimation('电话', userInfo.phone, false, 'phone')">
					<!-- 左侧标题 -->
					<view class="row-left">电话</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ userInfo.phone }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
				
				<!-- 每一行的信息 -->
				<view class="row" @tap="modifyAnimation('邮箱', userInfo.userEmail, false, 'userEmail')">
					<!-- 左侧标题 -->
					<view class="row-left">邮箱</view>
					<!-- 中间信息 -->
					<view class="row-center">{{ userInfo.userEmail }}</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
		
			<!-- 第三段信息区域 -->
			<view class="main-third" v-if="userId === userLocalInfo.id">
				<!-- 每一行的信息 -->
				<view class="row" @tap="modifyAnimation('密码', userInfo.userEmail, true)">
					<!-- 左侧标题 -->
					<view class="row-left">密码</view>
					<!-- 中间信息 -->
					<view class="row-center">******</view>
					<!-- 右侧按钮 -->
					<view class="row-right"><image src="../../static/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
		</view>
		
		<!-- 底部删除好友按钮 -->
		<view v-if="userFlag === '2'" class="delete-btn" @tap="signOut">退出登录</view>
		<view v-else-if="userFlag === 'true'" class="delete-btn" @tap="deleteFriend">删除好友</view>
		
		<!-- 修改数据的弹出层 -->
		<view class="modify" id="modify" :style="{ bottom: '-' + elementHeight + 'px' }" :animation="animationData1">
			<!-- 头部区域 -->
			<view class="modify-header">
				<view class="cancle" @tap="modifyAnimation('备注')">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			
			<!-- 填写内容区域 -->
			<view class="modify-main"> 
				<view v-if="isPswShow">
					<input v-model="oldPsw" class="modify-newpsw" type="text" placeholder=" 请输入旧密码" placeholder-style="color: #999; font-weight: 400" />
					<input v-model="newPsw" class="modify-newpsw" type="text" placeholder=" 请设置新密码" placeholder-style="color: #999; font-weight: 400" />
				</view>
				<textarea v-else class="modify-content" v-model="modifyData" />
			</view>
		</view>
	</view>
</template>

<script>
	// 导入裁剪图片组件
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	
	// 导入我封装的功能函数
	import myHooks from '@/commons/js/hooks.js' 
	
	export default {
		data() {
			// 获取当前时间
			const currentDate = this.getDate({
				format: true
			})
			return {
				// 本地用户信息
				userLocalInfo: {
					id: '',
					token: ''
				},
				userId: '', // url 中的用户 id
				userFlag: '', // url 中的 flag 标识符（用来判断是不是好友）
				// 发送请求获取到的用户信息
				userInfo: {
					id: '',
					userName: '',
					userEmail: '',
					sex: '',
					birth: '',
					phone: '',
					introduction: '', // 个性签名
					image: '',
					time: '' // 注册时间
				},
				infoType: '', // 要修改用户信息的类型
				nickName: '', // 给好友的备注
				tempFilePath: '', // 图片裁剪组件需要用到的数据
				cropFilePath: '', // 显示的头像
				sexArray: ['男', '女', '未知'], // 性别选择的数组
				modifyTitle: '', // 要修改的内容的标题
				modifyData: '', // 修改内容的文本域中的数据
				isPswShow: false, // 控制密码框显示
				oldPsw: '', // 旧密码
				newPsw: '', // 新密码
				isModify: false, // 控制动画的开关
				animationData1: {}, // 进行设置申请好友的输入框动画的对象
				elementHeight: 0 // modify 弹框节点的高度
			}
		},
		components: {
			ImageCropper // 裁剪图片组件
		},
		computed: {
			// 获取开始时间
			startDate() {
				return this.getDate('start');
			},
			// 获取结束时间
			endDate() {
				return this.getDate('end');
			}
		},
		filters:{
			// 处理时间函数
			changeTime(date) {
				return myHooks.formatTime(date)
			}
		},
		onLoad(e) {
			this.userId = e.id
			this.userFlag = e.flag
			this.getLocalUserInfo() // 获取本地数据
			this.getUserInfo() // 发送请求获取用户数据
			if(this.userFlag === 'true') {
				this.getNickName() // 获取好友昵称
			}
		},
		onReady() {
			// 页面加载的时候调用获取节点样式方法
			this.getElementStyle()
		},
		methods: {
			// 获取本地用户登录的数据
			getLocalUserInfo() {
				try {
				  const value = uni.getStorageSync('shuangChat-user');
				  if (value) {
						// 如果有本地数据，就获取数据
				    this.userLocalInfo.id = value.id
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
			getUserInfo() {
				uni.request({
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
							this.userInfo.id = userData.result._id
							this.cropFilePath = this.userInfo.image // 获取用户头像
							this.userInfo.birth = myHooks.formatTimeDay(this.userInfo.birth)
							
							if(this.userId === this.userLocalInfo.id) {
								this.updateLocalInfo()
							}
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
			// 性别选择触发的事件
			bindPickerChange(e) {
				this.userInfo.sex = e.target.value // 修改性别下标
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.userId,
						data: e.target.value,
						type: 'sex',
						token: this.userLocalInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userData = data.data
						// 如果请求成功
						if(userData.status === 200) {
							this.getUserInfo() // 更新数据
							uni.showToast({
								icon: 'success',
							  title: '修改成功~',
							  duration: 1250
							});
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
			// 改变生日触发的事件
			bindDateChange: function(e) {
				this.userInfo.birth = e.target.value // 修改生日日期
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.userId,
						data: e.target.value,
						type: 'birth',
						token: this.userLocalInfo.token
					},
					method: 'POST',
					// 成功的回调
					success: (data) => {
						const userData = data.data
						// 如果请求成功
						if(userData.status === 200) {
							this.getUserInfo() // 更新数据
							uni.showToast({
								icon: 'success',
							  title: '修改成功~',
							  duration: 1250
							});
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
			// 格式化时间的函数
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 下面是图片裁剪组件的事件
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			// 上传图片
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath; // 上传的图片
				const imageUrl = e.detail.tempFilePath; // 要上传给服务器的图片地址
				const fileUrl = 'user'; // 传递给后端要放在的文件夹名，user 文件夹用来存用户头像
				
				uni.uploadFile({
					url: this.serverUrl + '/files/upload',
					filePath: imageUrl,
					name: "file",
					fileType: "image",
					formData: {
						fileUrl: fileUrl, // 自定义的文件地址
						fileName: this.userLocalInfo.id, // 自定义的文件名，这直接写用户 id 接口，用户 id 是唯一的
						token: this.userLocalInfo.token
					},
					success: (uploadFileRes) => {
						// 格式化地址，获取到图片的地址
						const path = this.serverUrl + '/' + JSON.parse(uploadFileRes.data).filePath;
						// 发送修改信息的请求
						uni.request({
							url: this.serverUrl + '/user/update',
							data: {
								id: this.userId,
								data: path,
								type: 'image',
								token: this.userLocalInfo.token
							},
							method: 'POST',
							// 成功的回调
							success: (data) => {
								const userData = data.data
								// 如果请求成功
								if(userData.status === 200) {
									this.getUserInfo() // 更新数据
									uni.showToast({
										icon: 'success',
									  title: '修改成功~',
									  duration: 1250
									});
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
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
			},
			// 取消上传图片
			cancel() {
				this.tempFilePath = "";
			},
			// 动态获取页面节点的高度
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#modify').boundingClientRect(data => {
					this.elementHeight = data.height;
				}).exec();
			},
			// 修改项弹框动画
			modifyAnimation(title, data, bool, type) {
				// 只有是本地登录的用户才可以修改自己的详情页
				if(this.userId === this.userLocalInfo.id || title === '备注') {
					if((title && data) || title === '备注') {
						this.modifyTitle = title; // 获取修改内容的标题
						this.modifyData = data; // 获取修改的内容
						this.isPswShow = bool; // 控制密码框显示
						this.infoType = type; // 获取要修改的数据的类型
					}
					
					this.isModify = !this.isModify
					// 添加动画
					const animation1 = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					
					if(this.isModify) {
						animation1.bottom(0).step()
					} else {
						animation1.bottom(-this.elementHeight).step()
					}
					
					this.animationData1 = animation1.export()
				}
			},
			// 修改信息的确认按钮
			modifySubmit() {
				console.log(this.infoType)
				// 如果是修改密码，发送修改密码的请求
				if(this.isPswShow) {
					uni.request({
						url: this.serverUrl + '/user/update',
						data: {
							id: this.userId,
							data: this.newPsw,
							type: 'password',
							password: this.oldPsw,
							token: this.userLocalInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userData = data.data
							// 如果请求成功
							if(userData.status === 200) {
								// 路由跳转
								uni.navigateTo({
								  url: '../Login/Login'
								});
							} else if (userData.status === 400) {
								uni.showToast({
									icon: 'error',
								  title: '旧密码不正确！',
								  duration: 1250
								});
								this.oldPsw = ''
								this.newPsw = ''
							} else if(userData.status === 500) {
								uni.showToast({
									icon: 'error',
								  title: '服务器出错',
								  duration: 1250
								});
							}
						}
					})
				} else if(this.infoType === 'nickName') {
					console.log(1)
					// 修改好友备注
					uni.request({
						url: this.serverUrl + '/friend/updateNickName',
						data: {
							uid: this.userLocalInfo.id,
							fid: this.userId,
							nickName: this.modifyData,
							token: this.userLocalInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userData = data.data
							// 如果请求成功
							if(userData.status === 200) {
								this.nickName = this.modifyData
								this.modifyAnimation('备注') // 改变动画
								uni.showToast({
									icon: 'success',
								  title: '修改备注成功~',
								  duration: 1250
								});
							} else if(userData.status === 500) {
								uni.showToast({
									icon: 'error',
								  title: '服务器出错',
								  duration: 1250
								});
							}
						}
					})
				} else {
					// 发送修改信息的请求
					uni.request({
						url: this.serverUrl + '/user/update',
						data: {
							id: this.userId,
							data: this.modifyData,
							type: this.infoType,
							token: this.userLocalInfo.token
						},
						method: 'POST',
						// 成功的回调
						success: (data) => {
							const userData = data.data
							// 如果请求成功
							if(userData.status === 200) {
								this.getUserInfo() // 更新数据
								this.modifyAnimation() // 改变动画
								uni.showToast({
									icon: 'success',
								  title: '修改成功~',
								  duration: 1250
								});
							} else if(userData.status === 300) {
								uni.showToast({
									icon: 'error',
								  title: userData.message,
								  duration: 1250
								});
							} else if(userData.status === 500) {
								uni.showToast({
									icon: 'error',
								  title: '服务器出错',
								  duration: 1250
								});
							}
						}
					})
				}
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
			// 每次更新用户名、邮箱、头像后，更新本地数据
		  updateLocalInfo() {
				// 修改本地数据
			  try{
			  	uni.setStorageSync('shuangChat-user', {
			  		'id': this.userLocalInfo.id,
			  		'userName': this.userInfo.userName,
			  		'userEmail': this.userInfo.userEmail,
			  		'image': this.userInfo.image,
			  		'token': this.userLocalInfo.token
			  	});
			  }catch(e){
			  	console.log('本地信息存储出错！')
			  }
			},
			// 退出登录
			signOut() {
				uni.showModal({
					title: '提示',
					content: '请再次确认！',
					success: (res) => {
						if (res.confirm) {
							// 路由跳转
							uni.navigateTo({
								url: '../Login/Login' 
							});
							uni.removeStorageSync('shuangChat-user') // 删除本地数据
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 删除好友
			deleteFriend() {
				// 模态框
				uni.showModal({
					title: '提示',
					content: '确认删除好友吗？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/rejectOrDelete',
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
										uni.navigateTo({
										  url: '../AddUser/AddUser?id=' + this.userId + '&flag=false'
										});
										uni.showToast({
											icon: 'success',
										  title: '删除成功！',
										  duration: 1250
										});
									} else if(userData.status === 300) {
										uni.showToast({
											icon: 'error',
										  title: '删除好友失败！',
										  duration: 1250
										});
									} else if(userData.status === 500) {
										uni.showToast({
											icon: 'error',
										  title: '服务器出错！',
										  duration: 1250
										});
									}
								}
							})
						} else if (res.cancel) {}
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
		padding-top: var(--status-bar-height);
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
			width: 100rpx;
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
		padding: 20rpx 30rpx;
		// 第一段信息样式
		.main-first {
			border-bottom: 1px solid #ddd;
		}
		// 第二段信息样式
		.main-second {
			border-bottom: 1px solid #ddd;
		}
		// 第三段信息样式
		.main-third {
			border-bottom: 1px solid #ddd;
		}
		// 每一行的样式
		.row {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			width: 100%;
			height: 124rpx;
			
			// 左侧标题
			.row-left {
				width: 100rpx;
				height: 44rpx;
				font-size: 32rpx;
			}
			
			// 中间数据
			.row-center {
				flex: 1;
				font-size: 32rpx;
				color: rgba(39,40,50,0.60);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				
				image {
					width: 54px;
					height: 54px;
					border-radius: 10px;
				}
			}
			
			// 右侧按钮
			.row-right {
				width: 64rpx;
				text-align: right;
				image {
					width: 14px;
					height: 14px;
				}
			}
		}
	}

	// 删除好友按钮
	.delete-btn {
		width: 100%;
		text-align: center;
		padding: 72rpx 0;
		letter-spacing: 2px;
		color: #FF5D5B;
		font-weight: 700;
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
			// 新密码框的样式
			.modify-newpsw {
				width: 686rpx;
				margin: 0 auto;
				margin-top: 36rpx;
				padding: $uni-spacing-col-base;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			
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
