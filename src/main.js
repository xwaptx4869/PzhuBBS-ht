import Vue from 'vue'
import App from './App.vue'
import VCharts from 'v-charts'
import VueAMap from 'vue-amap'
import ls from 'local-storage'

import router from './router'
import store from './store'
import Utils from './utils/utils'
import Common from './utils/common'

import './plugins/axios'
import './plugins/element.js'

import 'font-awesome/css/font-awesome.css'

Vue.use(VCharts)

Vue.config.productionTip = false

Vue.prototype.xutils = Utils
Vue.prototype.xcommon = Common

// 用户是否登录钩子
router.beforeEach((to, from, next) => {
	if (to.path ==='/login/') {return next()}
	// const token = ls.get('token')
	// if (token) {
	// 	if (!store.state.User.token) {
	// 		// 获取用户信息
	// 		store.dispatch('setUser')
	// 		// 设置全局信息
	// 		store.dispatch('setSystem')
	// 	}
	// 	next()
	// } else {
	next()
	// }
})

// 高德地图API
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
	key: '7d513c41f8305cbd3193176202becd31',
	plugin: [
		'AMap.Geolocation',
		'AMap.Autocomplete',
		'AMap.PlaceSearch',
		'AMap.Scale',
		'AMap.OverView',
		'AMap.ToolBar',
		'AMap.MapType',
		'AMap.PolyEditor',
		'AMap.CircleEditor',
		'AMap.ToolBar'
	],
	// 默认高德 sdk 版本为 1.4.4
	v: '1.4.11',
	uiVersion: '1.0'
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')