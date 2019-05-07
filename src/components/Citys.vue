<template>
    <el-cascader
        :options="citySelect"
        @change="onChange"
		v-model="citys"
		:show-all-levels="false"
        @active-item-change="onItemChange">
    </el-cascader>
</template>
<script>
export default {
	name: 'MCitys',
	props: {
		value: String
	},
	data () {
		return {
			citySelect: [],
			citys: []
		}
	},
	created () {
		if(this.citySelect.length <= 0){
			this.xcommon.getCitys().then(data => {
				this.citySelect = data
			})
		}
	},
	methods: {
		// 城市数据反查
		setCitys (citys) {
			this.citys = citys
			const province = this.getItemCity([citys[0]])
			let city = {}
			this.xcommon.getCitys(citys[0], 1).then(data => {
				if(province.children) province.children = data
				city = this.getItemCity([citys[0], citys[1]])
				return this.xcommon.getCitys(citys[1], 2)
			}).then(data => {
				if(city.children) city.children = data
			})
		},
		// 重置数据
		resetData () {
			this.citys = []
		},
		// 同步数据
		onChange (item) {
			this.$emit('update:value', item[item.length - 1])
		},
		// 选择查询城市数据
		onItemChange (item) {
			const city = this.getItemCity(item)
			this.xcommon.getCitys(city.value, item.length).then(data => {
				if(city.children) city.children = data
			})
		},
		// 获取某一级数据对象
		getItemCity (item) {
			const citys = this.citySelect
			let country = {}
			let province = {}
			// 获取国家对象
			citys.forEach(element => {
				if(element.value === item[0]){
					country = element
				}
			});
			if(item.length === 1) return country
			// 获取省对象
			country.children.forEach(element => {
				if(element.value === item[1]){
					province = element
				}
			});
			return province
		}
	}
}
</script>
<style lang="scss" scoped>
</style>