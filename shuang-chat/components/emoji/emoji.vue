<template>
	<view class="emoji" :style="{ height: height + 'px' }">
		<view class="emoji-line" v-for="(line, i) in emoji" :key="'line' + i">
			<view class="emoji-line-item" v-for="(item, index) in line" :key="'item' + index" @tap="clickEmoji(item)">
				{{ item }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 这个 emoji 的高度应该根素父元素的高度变化，这个控制整个 emoji 的高度
			height: {
				type: Number,
				default: 230
			}
		},
		data() {
			return {
				// 全部的 emoji 标签数组
				emoji: [
					['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆'],
					['😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙'],
					['😚', '☺️', '🙂', '🤗', '🤔', '😐', '😑', '😶'],
					['🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪'],
					['😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒'],
					['😓', '😔', '😕', '🙃', '🤑', '😲', '👦', '🙁'],
					['😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧'],
					['😨', '😩', '😬', '😰', '😱', '😳', '😵', '😡'],
					['😠', '😷', '🤕', '🤒', '🤢', '🤧', '😇', '🤠'],
					['🤡', '🤥', '🤓', '😈', '👿', '👹', '👺', '💀'],
					['👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻'],
					['😼', '😽', '🙀', '😿', '😾', '🏻', '🏼', '🏽'],
					['🏾', '🏿', '🗣', '👤', '👥', '👫', '👫', '👬'],
					['👂', '👂🏻', '👂🏼', '👂🏽', '👂🏾', '👂🏿', '👃', '👃🏻'],
					['👃🏼', '👃🏾', '👃🏿', '👣', '👀', '👁', '👅', '👄'],
					['💋', '👓', '🕶', '👔', '👕', '👖', '👗', '👘'],
					['👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟'],
					['👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '⛑'],
					['💄', '💍', '🌂', '💼', '👈', '👉', '☝', '👇']
				]
			}
		},
		methods: {
			// 点击 emoji 的方法，传递给父组件
			clickEmoji(e) {
				this.$emit('emojis', e)
			},
		}
	}
</script>

<style lang="scss">
// emoji 区域 
.emoji {
	width: 100%;
	padding: 16rpx 10rpx 66rpx;
	box-sizing: border-box;
	overflow-y: auto;
	
	// 每一行的样式
	.emoji-line {
		display: flex;
		justify-content: space-evenly;
		text-align: center;
		padding: 10rpx 0;
		
		.emoji-line-item {
			flex: 1;
			font-size: 32rpx;
		}
	}
}
</style>
