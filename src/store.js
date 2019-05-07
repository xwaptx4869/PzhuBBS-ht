import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import User from '@/store/modules/User'
import System from '@/store/modules/System'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	modules: {
		User,
		System
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})