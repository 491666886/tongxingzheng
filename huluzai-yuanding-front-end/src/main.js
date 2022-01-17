import Vue from 'vue';
import App from './App';
import Element from 'element-ui';
import router from './router';
import store from './store';
// // 权限控制
import './permission';
// 公共样式表
import './style/element-variables.scss'
import './style/index.scss';
import './style/common.scss';
import './style/element-custom.scss'
// 引入iconfont
import './assets/iconfont/iconfont.css';
import filters from './filters';
import axios from 'axios'
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
import 'video.js/dist/video-js.css'
import  "babel-polyfill"
Vue.use(Element);
// 应用过滤器
for (const key in filters) {
	Vue.filter(key, filters[key])
}




new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
})
