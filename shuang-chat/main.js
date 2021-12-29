import App from './App'
import Vue from 'vue'

// 导入 socket.io 模块
import io from "./components/socket/weapp.socket.io.js"

Vue.prototype.serverUrl = 'http://172.21.144.119:8888' // 设置全局的服务器地址
Vue.prototype.socket = io('http://172.21.144.119:8001') // 设置全局的 socket 服务器地址

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App
})

app.$mount()