'use strict'

import Vue from 'vue'
import axios from 'axios'
import ls from 'local-storage'
import router from '@/router'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
	baseURL: process.env.baseURL || process.env.apiUrl || '',
	timeout: 60 * 1000 // Timeout
	// withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
	function (config) {
		if (!(config.url.indexOf('upload') > -1))
			{config.url = `api${config.url}`}
		else{
			config.url = `upload${config.url}`
			console.log(config.url)
		}
		const _token = ls.get('token')
		if (_token) {
			config.headers.token = _token
		}
		// Do something before request is sent
		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
_axios.interceptors.response.use(
	function (response) {
		// Do something with response data
		// console.log(response)
		// const { data, errmsg, status, errcode, result } = response.data
		// const responseData = {
		// 	code: status ? 0 : errcode,
		// 	message: errmsg || ''
		// }
		// if (data && data.page_size) {
		// 	responseData.data = data.record || []
		// 	responseData.total = data.total || 0
		// } else {
		// 	responseData.data = data || result
		// }
		// 未登录
		// if (errcode === 'not.login') {
		// 	ls.remove('token')
		// 	router.push('/login/')
		// }
		// response.data = responseData
		return response
	},
	function (error) {
		// Do something with response error
		return Promise.reject(error)
	}
)

Plugin.install = function (Vue, options) {
	Vue.axios = _axios
	window.axios = _axios
	Object.defineProperties(Vue.prototype, {
		axios: {
			get () {
				return _axios
			}
		},
		$axios: {
			get () {
				return _axios
			}
		}
	})
}

Vue.use(Plugin)

export default Plugin