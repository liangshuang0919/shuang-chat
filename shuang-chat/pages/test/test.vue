<template>
	<view>
		<view class="test" @tap="upload">文件上传</view>
		<image v-for="(item, index) in img" :key="index" :src="item"></image>
	</view>
</template>

<script>
	// 导入自己封装的功能函数
	import myHooks from '@/commons/js/hooks.js';
	
	export default {
		data() {
			return {
				img: []
			}
		},
		methods: {
			upload() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						
						// 一次上传多张图片
						for(let i = 0; i < tempFilePaths.length; i++) {
							const fileUrl = myHooks.formatTimeDay(new Date()) // 动态生成文件地址
							const fileName = Date.now() + '61c4511da34e8d1936ee7d4d' + i // 动态生成文件名
							const uploadTask = uni.uploadFile({
								url:this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
									'fileUrl': fileUrl,
									// 前端自定义的命名
									'fileName': fileName
								},
								success: (uploadFileRes) => {
									// 获取到后端返回的文件数据
									// 格式化地址，获取到图片的地址
									const path = JSON.parse(uploadFileRes.data).filePath
									// 将图片存入的 img 数组中
									this.img.push(this.serverUrl + '/' + path)
								}
							});
									
							uploadTask.onProgressUpdate((res) => {
								// console.log('上传进度' + res.progress);
								// console.log('已经上传的数据长度' + res.totalBytesSent);
								// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
								
								// 测试条件，取消上传任务。
								// if (res.progress > 50) {
								// 		uploadTask.abort();
								// }
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
.text {
	background-color: #eee;
	max-height: 100rpx;
	padding: 20rpx;
	margin: 0 10rpx;
	word-wrap : break-word;
	overflow: scroll;
}
</style>
