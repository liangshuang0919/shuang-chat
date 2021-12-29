<template>
	<view>
		<!-- 底部组件 -->
		<view class="submit" id="submit">
			<!-- 发送消息框区域 -->
			<view class="submit-chat">
				<!-- 左侧语音按钮 -->
				<!-- 原本的图标 -->
				<view class="bt-img" @tap="handleRecord">
					<image :src="isRecord ? recordImg[0] : recordImg[1]"></image>
				</view>
				<!-- 按下语音按钮后的图标 -->
				
				<!-- 中间输入框 -->
				<textarea auto-height="true" class="chat-text btn" v-show="!isRecord" v-model="message" maxlength="-1" @focus="handleFocus"></textarea>
				<view class="btn record" v-show="isRecord" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
					按住说话
				</view>
				
				<!-- 右侧按钮表情按钮 -->
				<view class="bt-img" @tap="emoji">
					<image src="../../static/submit/bq.png" ></image>      
				</view>
				<!-- 右侧按钮功能按钮 -->
				<view class="bt-img" v-if="message.length === 0" @tap="more">
					<image src="../../static/submit/tj.png"></image>
				</view>
				<!-- 当有文字的时候，显示发送按钮 -->
				<view class="send-btn" @tap="inputs" v-else>发送</view>
			</view>
			
			<!-- 聊天框下面功能部分的区域 -->
			<!-- 表情功能 -->
			<view class="emoji" v-show="isEmoji">
				<!-- 处理 emoji 的按钮 -->
				<view class="emoji-handle" @tap="backMsg">
					<view class="emoji-delete">
						<image src="../../static/submit/back.png"></image>
					</view>
				</view>
				<!-- emoji 组件 -->
				<emoji @emojis="emojition" :height="230"></emoji>
			</view>
			<!-- 其他功能 -->
			<view class="more" v-show="isMore">
				<!-- 功能列表 -->
				<view class="more-list" @tap="sendImg('photo')">
					<image src="../../static/submit/tp.png" mode=""></image>
					<view class="more-title">图片</view>
				</view>
				<view class="more-list" @tap="getLocation">
					<image src="../../static/submit/dw.png" mode=""></image>
					<view class="more-title">定位</view>
				</view>
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/submit/pz.png" mode=""></image>
					<view class="more-title">拍照</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/sp.png" mode=""></image>
					<view class="more-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/wj.png" mode=""></image>
					<view class="more-title">文件</view>
				</view>
			</view>
		</view>
		
		
		<!-- 取消录音的那个遮罩层 -->
		<view class="voice-bg" v-show="cancleVoice">
			<!-- 录音时长 -->
			<view class="voice-bg-len">
				<!-- 录音时间的时长文字 -->
				<view class="voice-bg-time" :style="{ width: voiceTime / 0.6 + '%' }">{{ voiceTime }}″</view>
			</view>
			<!-- 上划取消 -->
			<view class="voice-del">上划取消录音</view>
		</view>
	</view>
</template>

<script>
	// 导入 emoji 组件
	import emoji from "../emoji/emoji.vue"
	
	const recorderManager = uni.getRecorderManager(); // uni-app 开始录音的 API
	export default {
		data() {
			return {
				isRecord: false, // 控制当前是否为录音状态
				isEmoji: false, // 控制表情是否显示
				recordImg: ['../../static/submit/jp.png', '../../static/submit/yy.png'], // 语音按钮的图标
				message: '', // 发送的内容
				submitHeight: '', // submit 区域的高度
				isMore: false, // 控制更多功能的显示
				timer: null, // 记录音频的计时器
				voiceTime: 0, // 录音的时长
				cancleVoice: false, // 控制取消录音遮罩层
				pageY: 0, // 用来记录当前点击发送语音的 Y 轴坐标
			}
		},
		components: {
			emoji
		},
		methods: {
			// 动态获取整个页面节点的高度
			getElementHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#submit').boundingClientRect(data => {
					this.$emit('heights', data.height)
				}).exec();
			},
			// 点击录音图标触发的事件
			handleRecord() {
				this.isEmoji = false
				this.isMore = false
				setTimeout(() => {
					this.getElementHeight(); // 调用获取 emoji 节点的高度
				}, 10);
				this.isRecord = !this.isRecord // 切换语音状态
			},
			// 表情按钮触发的事件
			emoji() {
				this.isEmoji = !this.isEmoji
				this.isMore = false
				this.isRecord = false // 切换语音状态
				setTimeout(() => {
					this.getElementHeight(); // 调用获取 emoji 节点的高度
				}, 10);
			},
			// 发送消息
			inputs(e) {
				if(this.message.length > 0) {
					this.sendMessage(this.message, '0')
				}
			},
			// 获取到子组件中的 emoji
			emojition(e) {
				this.message += e
			},
			// 删除按钮事件
			backMsg() {
				if(this.message.length > 0) {
					this.message = this.message.substring(0, this.message.length - 1)
				}
			}, 
			// textarea 聚焦事件
			handleFocus() {
				this.isEmoji = false
				this.isMore = false
				setTimeout(() => {
					this.getElementHeight(); // 调用获取整个页面节点的高度
				}, 10);
			},
			// 要发送给好友的消息
			// msg 是发送的消息，type 是发送的消息类型
			sendMessage(msg, type) {
				const data = {
					message: msg,
					types: type
				}
				this.$emit('inputmsg', data);
				setTimeout(() => {
					this.message = ''
				}, 0)
			},
			// 点击更多功能按钮
			more() {
				this.isMore = !this.isMore
				this.isEmoji = false
				this.isRecord = false // 切换语音状态
				setTimeout(() => {
					this.getElementHeight(); // 调用获取整个页面节点的高度
				}, 10);
			},
			// 发送图片的方法
			sendImg(type) {
				let count = 9; // 最多上传的图片数
				if(type === 'album') {
					// 如果是发送照片，去相册选择
					count = 1;
				} else {
					count = 9;
				}
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						const filePath = res.tempFilePaths; // 获取到上传图片的地址
						for(let i = 0; i < filePath.length; i++) {
							this.sendMessage(filePath[i], '1');
						}
					}
				});
			},
			// 处理音频
			// 开始录音
			touchstart(e) {
				this.cancleVoice = true // 录音的时候显示取消录音的遮罩层
				
				this.pageY = e.changedTouches[0].pageY // 获取手指点击发送语音的起始坐标点
				
				let index = 0; // 时间记录
				this.timer = setInterval(() => {
					if(index > 60) {
						clearInterval(this.timer)
						this.touchend() // 录音时长超过 60s 也要关闭录音
					}
					index++
					this.voiceTime = index // 获取录音时长
				}, 1000)
				recorderManager.start(); // 调用录音的 API，默认是 1 分钟
			},
			// 结束录音
			touchend() {
				clearInterval(this.timer)
				recorderManager.stop(); // 调用结束录音的 API
				// 触发结束事件
				recorderManager.onStop((res) => {
					const data = {
						voice: res.tempFilePath, // 音频的地址
						time: this.voiceTime // 录音时长
					}
					// 当遮罩层存在，即没有上划取消录音的时候，才可以发送语音给好友
					if(this.cancleVoice) {
						this.sendMessage(data, '2') // 发送音频
					}
					this.voiceTime = 0 // 清空时间
					this.cancleVoice = false // 录音的时候关闭取消录音的遮罩层
				});
			},
			// 上划取消录音
			touchmove(e) {
				if(this.pageY - e.changedTouches[0].pageY > 100) {
					this.cancleVoice = false // 录音的时候关闭取消录音的遮罩层
					this.touchend() // 关闭发送
				} 
			},
			// 获取定位
			getLocation() {
				uni.chooseLocation({
					success: (res) => {
						const localData = {
							localName: res.name, // 定位的位置名
							localAddress: res.address, // 定位的详细地址
							localLatitude: res.latitude, // 定位的纬度
							localLongitude: res.longitude // 定位的经度
						}
						// 因为这个存的时候是个对象，需要转成字符串才可以存入数据库中
						const localDataStr = JSON.stringify(localData)
						this.sendMessage(localDataStr, '3') 
					}
				});
			},
		}
	}
</script>

<style lang="scss">
.submit {
	position: fixed;
	bottom: 0;
	width: 100%;
	// padding-bottom: env(safe-area-inset-bottom);
	background: rgba(244, 244, 244, 1);
	border-top: 1px solid $uni-border-color;
	z-index: 5;
	
	// 发送消息框区域
	.submit-chat {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-end;
		box-sizing: border-box;
		width: 100%;
		padding: 17rpx 0;
		
		// 发送按钮
		.send-btn {
			height: 100%;
			padding: 5rpx 25rpx;
			line-height: 55rpx;
			background-color: rgba(6, 149, 245, 1);
			border-radius: 10rpx;
			color: #fff;
		}
		
		// 下面的三个按钮
		.bt-img {
			width: 50rpx;
			height: 50rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		// 中间输入框
		.btn {
			box-sizing: border-box;
			width: 500rpx;
			max-height: 100rpx;
			padding: 10rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			overflow: scroll;
		}
		
		// 录音状态下的输入框样式
		.record {
			font-size: 30rpx;
			text-align: center;
			color: $uni-text-color;
		}
	}
	
	// 表情的区域
	.emoji {
		width: 100%;
		height: 460rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
		
		// emoji 处理的按钮
		.emoji-handle {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			bottom: 15rpx;
			right: 15rpx;
			width: 100rpx;
			height: 70rpx;
			box-shadow: 0 0 15rpx 5rpx rgba(0, 0, 0, 0.1);
			
			// 删除按钮
			.emoji-delete {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 70rpx;
				background-color: #FFFFFF;
				border-radius: 12rpx;
				
				image {
					width: 40rpx;
					height: 30rpx;
				}
			}
		}
	}
	
	// 更多功能区域
	.more {
		box-sizing: border-box;
		bottom: env(safe-area-inset-bottom);
		width: 100%;
		height: 436rpx;
		padding: 4rpx 20rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
		
		.more-list {
			float: left;
			width: 25%;
			text-align: center;
			padding-top: 32rpx;
			
			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background-color: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
			}
			
			.more-title {
				line-height: 34rpx;
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.5);
			}
		}
	}
	
}

// 取消录音的遮罩层区域
.voice-bg { 
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 2;
	
	// 遮罩层中间的时长区域
	.voice-bg-len {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 600rpx;
		height: 84rpx;
		margin: auto;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 42rpx;
		text-align: center;
		
		// 时间
		.voice-bg-time {
			display: inline-block;
			min-width: 120rpx;
			line-height: 84rpx;
			background-color: rgba(6, 149, 245, 0.6);
			border-radius: 42rpx;
			text-align: center;
			color: #fff;
			font-weight: 700;
		}
	}
	
	// 上划取消文字
	.voice-del {
		position: absolute;
		bottom: 148rpx;
		width: 100%;
		margin-bottom: env(safe-area-inset-bottom);
		text-align: center;
		letter-spacing: 5rpx;
		color: #fff;
	}
}
</style>
