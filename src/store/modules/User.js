import ls from 'local-storage'
import {
	SET_USERINFO,
	SET_TOKEN,
	LOGOUT,
	SET_PERMISSIONS
} from '@/store/MutationTypes'

const state = {
	userInfo: null, // 用户信息
	token: '', // 请求token
	permissions: [] // 后台权限
}

const mutations = {
	[SET_USERINFO] (state, { user }) {
		state.userInfo = user
		ls.set('user', escape(JSON.stringify(user)))
	},
	[SET_TOKEN] (state, { token }) {
		state.token = token
		ls.set('token', token)
	},
	[SET_PERMISSIONS] (state, { permissions }) {
		state.permissions = permissions
		ls.set('permissions', JSON.stringify(permissions))
	},
	[LOGOUT] (state) {
		state.userInfo = {}
		state.token = ''
		state.permissions = []
		ls.remove('token')
		ls.remove('user')
		ls.remove('permissions')
	}
}

const actions = {
	setUser ({ commit, state }) {
		let user = ls.get('user')
		const token = ls.get('token')
		const permissions = ls.get('permissions')
		user = JSON.parse(unescape(user))
		commit('SET_USERINFO', { user })
		commit('SET_TOKEN', { token })
		commit('SET_PERMISSIONS', { permissions: JSON.parse(permissions) })
	}
}

export default {
	state,
	actions,
	mutations
}