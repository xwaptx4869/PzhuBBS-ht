<template>
	<span class="help-menu">
		<el-select v-model="prevId" @change="onPrevChange" placeholder="请选择">
			<el-option
				v-for="item in pidSelect"
				:key="item.id"
				:label="item.title"
				:value="item.id">
			</el-option>
		</el-select>
		<el-select v-if="nidSelect.length > 0" @change="onNextChange" v-model="nextId" placeholder="请选择">
			<el-option
				v-for="item in nidSelect"
				:key="item.id"
				:label="item.title"
				:value="item.id">
			</el-option>
		</el-select>
	</span>
</template>
<script>
import _ from 'lodash'
export default {
	name: 'MHelpMenu',
	props: {
		pid: [Number, String],
		nid: [Number, String]
	},
	data () {
		return {
			pidSelect: [],
			nidSelect: [],
			prevId: this.pid,
			nextId: this.nid,
		}
	},
	watch: {
		nid: function (val) {
			if(val) {
				this.nextId = val
				this.xcommon.getHelpMenus(this.pid).then(data => {
					this.nidSelect = data
				})
			}
		},
		pid: function (val){
			this.prevId = val
		}
	},
	created () {
		if(this.pidSelect.length <= 0){
			this.xcommon.getHelpMenus().then(data => {
				data.unshift({id: '', title: '无'})
				this.pidSelect = data
			})
		}
	},
	methods: {
		resetData () {
			this.nidSelect = []
			this.nextId = ''
			this.prevId = ''
		},
		onPrevChange (id) {
			if(id === '') return this.nidSelect = []
			this.nextId = ''
			this.xcommon.getHelpMenus(id).then(data => {
				this.nidSelect = data
			})
			this.prevId = id
			this.$emit('update:pid', id)
		},
		onNextChange (id) {
			this.nextId = id
			this.$emit('update:nid', id)
		}
	}
}
</script>
<style lang="scss" scoped>
.help-menu {
	.el-select:last-child {
		margin-left: 10px;
	}
	.el-select:first-child {
		margin-left: 0px;
	}
}
</style>