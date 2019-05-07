<template>
	<div class="role-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/personnel/roles/' }">用户权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ type === 'edit' ? '编辑权限角色' : '新建权限角色' }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">{{ type === 'edit' ? '编辑权限角色' : '新建权限角色' }}</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="roleForm" :model="role" :rules="roleRules" label-width="180px">
						<el-form-item label="权限用户" prop="name">
							<el-input v-model="role.name" placeholder="请填写权限用户名"></el-input>
						</el-form-item>
						<el-form-item label="权限信息" prop="msg">
				    <el-select  v-model="role_msg" placeholder="请选择">
							<el-option
							v-for="item in roleSearch "
							:key="item.id"
							:label="item.label"
							:value="item.id">
							</el-option>
						</el-select>
						</el-form-item>
						<el-form-item>
                            <el-button type="primary" :loading="loading" @click="onSubmit" >提交</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { newsSearch, statusSelect, newsType, newsSort, newsSource,commentSource,roleSearch } from '@/utils/search'
export default {
	name: 'RoleAdd',
	data () {
		return {
			fgTrees: [],
			bgTrees: [],
			role: {
				backgrounds: [],
				foregrounds: []
			},
			roleSearch,
			roleRules: {
				name: [
					{required: true, message: '请输入用户角色名称', trigger: 'blur'},
				],
				msg: [
					{required: true, message: '请输入用户角色名称', trigger: 'blur'},
				]
			},
			loading: false,
			type: 'edit',
			role_id: '',
			role_msg:'',
			defaultProps: {
				children: 'child_permissions',
				label: 'name'
			},
			formFgs: [],
			formBgs: []
		};
	},
	created () {
		// if(!this.$route.path.match(new RegExp(/edit/))) {
		// 	this.type = 'add'
		// 	this.getPermissions().then(() => {})
		// }else {
		// 	this.role_id = this.$route.params.id
		// 	this.getPermissions().then(() => {
		// 		this.getRole()
		// 	})
		// }
	},
	methods: {
		// 获取选中数据
		getKeyIds (trees) {
			trees = trees.map(item => {
				return item.id
			})
			return trees
		},
		// 获取所有权限列表
		getPermissions () {
			return new Promise((resolve, reject) => {
				this.$axios.get('/roles/permissions').then(response => {
					const {code, data, message} = response.data
					if(code !== 0) return this.$message.error(message)
					this.fgTrees = data.foregrounds
					this.bgTrees = data.backgrounds
					resolve()
				})
			})
		},
		// 获取当前角色权限列表
		getRole () {
			const self = this
			this.$axios.get(`/roles/detail/${this.role_id}`).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.role = data
				data.foregrounds.forEach(item => {
					self.$refs.fgtree.setChecked(item, true)
				})
				data.backgrounds.forEach(item => {
					self.$refs.bgtree.setChecked(item, true)
				})
			})
		},
		updateRole () {
			this.loading = true
			const role = JSON.parse(JSON.stringify(this.role))
			role.backgrounds = this.formBgs
			role.foregrounds = this.formFgs
			this.$axios.post(`/roles/update/${this.role_id}`, role).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('用户角色管理更新成功');
				this.loading = false
				this.$router.go(-1)
			})
		},
		addRole () {
			this.loading = true
			const role = JSON.parse(JSON.stringify(this.role))
			role.backgrounds = this.formBgs
			role.foregrounds = this.formFgs
			this.$axios.post('/roles/add', role).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('用户角色创建成功');
				this.loading = false
				this.$router.go(-1)
			})
		},
		onSubmit () {
			this.$refs['roleForm'].validate((valid) => {
				// 设置权限树选中值
				this.formFgs = this.getKeyIds(this.$refs.fgtree.getCheckedNodes(false, true))
				this.formBgs = this.getKeyIds(this.$refs.bgtree.getCheckedNodes(false, true))
				if (valid) this.type === 'add' ? this.addRole() : this.updateRole()
			})
		}
	}
}
</script>
<style lang="scss">
</style>