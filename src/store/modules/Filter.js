import VueCookie from 'vue-cookie'
import { SET_CITYS } from '@/store/MutationTypes'

const state = {
	citys: [] // 城市数据
}

const mutations = {
	[SET_CITYS] (state, { city }) {
		if (state.length > 0) {
			// 城市子集
		} else {
			state.citys = city
		}
	}
}

const actions = {
	getCity ({ commit, state }) {
		this.$axios
			.get('/citys/', {
				params: {
					code: '',
					type: ''
				}
			})
			.then(response => {
				const { code, data, message } = response.data
				if (code !== 0) return this.$message.error(message)
				commit('SET_CITYS', { city: data })
			})
	}
}

export default {
	state,
	actions,
	mutations
}