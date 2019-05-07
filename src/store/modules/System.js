import ls from 'local-storage'
import { SET_IMAGE, SET_WAP, SET_APP_IMAGE } from '@/store/MutationTypes'
import '@/plugins/axios'

const state = {
	imagePath: '', // 图片前缀地址
	wapPath: '', // wap前缀地址
	appImagePath: '' // 图片前台服务器
}

const mutations = {
	[SET_IMAGE] (state, { url }) {
		state.imagePath = url
		ls.set('imagePath', url)
	},
	[SET_WAP] (state, { url }) {
		state.wapPath = url
		ls.set('wapPath', url)
	},
	[SET_APP_IMAGE] (state, { url }) {
		state.appImagePath = url
		ls.set('appImagePath', url)
	}
}

const actions = {
	setSystem ({ commit, state }) {
		const imagePath = ls.get('imagePath')
		commit('SET_IMAGE', { url: imagePath })
		const wapPath = ls.get('wapPath')
		commit('SET_WAP', { url: wapPath })
		const appImagePath = ls.get('appImagePath')
		commit('SET_APP_IMAGE', { url: appImagePath })
	},
	getImagePath ({ commit, state }) {
		axios.get('/file/baseurl').then(response => {
			const { code, data, message } = response.data
			if (code === 0) {
				commit('SET_IMAGE', { url: data.fileDomain })
				commit('SET_WAP', { url: data.h5Domain })
				commit('SET_APP_IMAGE', { url: data.imageDomain })
			}
		})
	}
}

export default {
	state,
	actions,
	mutations
}