// 我封装的各种功能函数
export default {
	// 处理首页好友消息时间显示
	handleTime(date) {
		// 需要实现一个时间处理功能：发送消息的时间是昨天就显示“昨天+时间”，前天的话就显示“前天+时间”，更前面的话就显示“日期+时间”
		const oldDate = new Date(date) // 获取用户发送最后一条消息的时间
		const nowDate = new Date() // 获取当前时间
		
		// 获取 oldDate 的具体时间
		const oldYear = oldDate.getFullYear()
		const oldMonth = oldDate.getMonth() + 1
		const oldDay = oldDate.getDate()
		const oldHours = oldDate.getHours() < 10 ? '0' + oldDate.getHours() : oldDate.getHours()
		const oldMinutes = oldDate.getMinutes() < 10 ? '0' + oldDate.getMinutes() : oldDate.getMinutes()
		// 获取 nowDate 的具体时间
		const nowYear = nowDate.getFullYear() 
		const nowMonth = nowDate.getMonth() + 1
		const nowDay = nowDate.getDate() 
		const nowHours = nowDate.getHours()  < 10 ? '0' + oldDate.getHours() : oldDate.getHours()
		const nowMinutes = nowDate.getMinutes() < 10 ? '0' + oldDate.getHours() : oldDate.getHours()
		
		if(oldYear === nowYear && oldMonth === oldMonth && oldDay === nowDay) {
			// 如果是今天发送的消息，就显示 小时:分钟
			return oldHours + ':' + oldMinutes
		} else if(oldYear === nowYear && oldMonth === oldMonth && oldDay + 1 === nowDay) {
			// 如果是昨天发送的消息，就显示 昨天 小时:分钟
			return '昨天 ' + oldHours + ':' + oldMinutes
		}  else if(oldYear === nowYear && oldMonth === oldMonth && oldDay + 2 === nowDay) {
			// 如果是前天发送的消息，就显示 前天 小时:分钟
			return '前天 ' + oldHours + ':' + oldMinutes
		}  else {
			// 如果是更早发送的消息，就显示 时间 小时:分钟
			return oldYear + '-' + oldMonth + '-' + oldDay + ' ' + oldHours + ':' + oldMinutes
		} 
	},
	// 格式化时间函数
	formatTime(date) {
		const time = new Date(date)
		
		// 获取 time 的具体时间
		const Y = time.getFullYear()
		const M = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
		const D = time.getDate()
		const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
		const m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
		
		return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
	},
	// 格式化时间函数（不格式化时分秒）
	formatTimeDay(date) {
		const time = new Date(date)
		
		// 获取 time 的具体时间
		const Y = time.getFullYear()
		const M = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
		const D = time.getDate()
		
		return Y + '-' + M + '-' + D;
	},
	// 控制消息发送的间隔时间差，当间隔小于 5 分钟的时候，就不显示时间了
	// old 是当前系统时间，msg1 是当前消息发送的时间；msg2 是上一条消息发送的时间 
	spacTime(old, msg1, msg2) {
		old = new Date(old);
		msg1 = new Date(msg1);
		msg2 = new Date(msg2);
		// 时间戳
		const oldTime = old.getTime();
		const msgTime1 = msg1.getTime();
		const msgTime2 = msg2.getTime();
		if(oldTime >= (msgTime1 + 1000 * 60 * 5) && msgTime1 >= (msgTime2 + 1000 * 60 * 5)) {
			return msg1;
		} else if(oldTime < (msgTime1 + 1000 * 60 * 5)) {
			return msg1;
		} else {
			return '';
		}
	},
	// 处理刚发送的消息的时间
	spacTime1(old, msg) {
		old = new Date(old);
		msg = new Date(msg);
		// 时间戳
		const oldTime = old.getTime();
		const msgTime = msg.getTime();
		if(msgTime >= (oldTime + 1000 * 60 * 5)) {
			return msg;
		} else {
			return '';
		}
	},
	// 防抖
	debounce(fn, time) {
		let delay = time || 500;
		let timer; // 定时器
		
		return function () {
			let args = arguments;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, args);
			}, delay);
		}
	},
	// 进行时间排序
	// arr 是数组；type 是要进行排序的属性名；flag 表示升序或者降序的标识符，0 是降序，1 是升序
	sortTime(arr, type, flag) {
		if(flag === 0) {
			// 降序
			for(let i = 0; i< arr.length; i++) {
				for(let j = i; j > 0; j--) {
					if(arr[j][type] > arr[j - 1][type]) {
						const s = arr[j];
						arr[j] = arr[j - 1];
						arr[j - 1] = s;
					} 
				}
			}
			return arr;
		} else if(flag === 1) {
			// 升序
			for(let i = 0; i< arr.length; i++) {
				for(let j = i; j > 0; j--) {
					if(arr[j][type] < arr[j - 1][type]) {
						const s = arr[j];
						arr[j] = arr[j - 1];
						arr[j - 1] = s;
					} 
				}
			}
			return arr;
		}
	},
}