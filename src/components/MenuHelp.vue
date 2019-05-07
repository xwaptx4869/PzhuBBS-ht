<template>
    <el-cascader
        :options="menuSelect"
        @change="onChange"
		v-model="menus"
        :props="props"
        change-on-select>
    </el-cascader>
</template>
<script>
import _ from 'lodash'
export default {
	name: 'MHelpMenu',
	props: {
		value: [String, Number]
	},
	data () {
		return {
			menuSelect: [],
			menus: [],
			props: {
				value: 'id',
				label: 'title',
				children: 'children'
			}
		}
	},
	created () {
		if(this.menuSelect.length <= 0){
			this.xcommon.getHelpMenus().then(data => {
				this.menuSelect = data
			})
		}
	},
	methods: {
		onChange (item) {
			const id = item[item.length - 1]
			this.xcommon.getHelpMenus(id).then(data => {
				this.updateMenu(id, data)
			})
			this.$emit('update:value', id)
		},
		updateMenu (id, data) {
			const menuSelect = JSON.parse(JSON.stringify(this.menuSelect))
			let menus = this.xutils.treeToArray(menuSelect, 'children')
			if(data.length){
				menus = menus.concat(data)
			}else {
				menus.forEach(element => {
					if(element.id === id) delete element.children
				});
			}
			menus = _.uniqBy(menus, 'id')
			this.menuSelect = this.xutils.treePermissions(menus, {parentId: 'pid'})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>