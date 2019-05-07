<template>
	<div class="role-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户权限管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">用户权限管理列表</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-section">
					<el-form ref="searchForm" :inline="true" :model="search" class="demo-form-inline">
						<el-form-item prop="name" label="用户权限">
							<el-input v-model="search.name" placeholder=""></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="xcommon.onSearch(search, getRoles)" icon="el-icon-search">查询</el-button>
                            <el-button icon="el-icon-edit" @click="$router.push({path: '/personnel/roles/add/'})" type="primary">新增</el-button>
						</el-form-item>
					</el-form>
				</div>
                <div class="smart-widget-body">
                    <el-table :data="roles" v-loading="loading" border style="width: 100%">
						<el-table-column fixed="left" width="110" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="$router.push({path: `/personnel/roles/edit/${scope.row.id}`})" size="small">编辑权限</el-button>
								<el-button type="text" @click="rowDelete(scope.$index)" size="small">删除</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="用户权限">
						</el-table-column>
						<el-table-column prop="describe" label="权限">
						</el-table-column>
					</el-table>
                </div>
                <div class="smart-widget-footer">
					<el-pagination
					:current-page.sync="search.page_num"
					:page-sizes="[20, 50, 100]"
					@current-change="getRoles"
					@size-change="getRoles"
					:page-size.sync="search.page_size"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
                    </el-pagination>
                </div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'RoleManage',
	data () {
		return {
			search: {
				name: '',
				page_num: 1,
				page_size: 20
			},
			total: 0,
			roles: [],
			loading: false
		}
	},
	created (){
		// this.getRoles()
	},
	methods: {
		resetSearchForm () {
			this.search.page_num = 1
			this.$refs.searchForm.resetFields()
			this.getRoles()
		},
		getRoles () {
			this.loading = true
			this.$axios.get('/roles', {
				params: this.search
			}).then(response => {
				const {code, data, message, total} = response.data
				if(code !== 0) return this.$message.error(message);
				this.roles = data
				this.loading = false
				this.total = total
			})
		},
		rowDelete (index) {
			this.$confirm('此操作将删除该用户权限信息, 是否继续?', '删除用户角色', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(() => {
				this.deleteRole(index)
			}).catch(() => {
				this.$message('已取消删除');
			})
		},
		deleteRole (index) {
			const role = this.roles[index]
			this.$axios.post(`/roles/delete/${role.id}`).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('删除角色成功');
				this.getRoles()
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>