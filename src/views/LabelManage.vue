<template>
	<div class="help-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>标签管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<el-tabs class="tabs-list" v-model="tabName" >
					<el-tab-pane label="标签管理" name="menu">
						<div class="smart-widget-section">
							<el-form ref="searchForm" :inline="true" :model="labelMenuSearch" class="demo-form-inline">
								<el-form-item prop="title" label="标签名">
									<el-input v-model="labelMenuSearch.name" placeholder=""></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="xcommon.onSearch(labelMenuSearch, getLabels)" icon="el-icon-search">查询</el-button>
									<el-button icon="el-icon-edit" @click="onaddLabels" type="primary">新建</el-button>
								</el-form-item>
							</el-form>
						</div>
						<div class="smart-widget-body">
							<el-table :data="labelMenus" v-loading="labelsLoading" border style="width: 100%">
								<el-table-column fixed="left" width="120" label="操作">
									<template slot-scope="scope">
										<el-button type="text" @click="addDialogVisible = true;currentOperate='edit';labelsup =JSON.parse(JSON.stringify(scope.row))" size="small">编辑</el-button>
										<el-button type="text" @click="rowDelete(scope.row.id)" size="small">删除</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="id" label="ID">
								</el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="name" label="标签名">
								</el-table-column>
								<el-table-column label="创建时间">
									<template slot-scope="scope">
										<p>{{ `${xutils.formatTime(scope.row.created_at)}` }}</p>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="smart-widget-footer">
							<el-pagination
							:page-sizes="[20, 50, 100]"
							@current-change="getLabels"
							@size-change="getLabels"
							layout="total, sizes, prev, pager, next, jumper"
							:total="labelsTotal">
							</el-pagination>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<!-- 批量删除 -->
		<el-dialog
			:title="currentOperate === 'edit' ? '标签编辑': '标签新建'"
			:visible.sync="addDialogVisible"
			width="450px">
			<div class="comment-detail dialog-content">
				<el-form ref="currentForm" :model="labelsup" :rules="labelsupRules" label-width="80px">
					<el-form-item prop="name" label="标签名">
						<el-input v-model="labelsup.name" :maxlength="20" ></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import MHelpMenu from '@/components/HelpMenu'
import MIntInput from '@/components/IntInput'
export default {
	name: 'HelpManage',
	components: {
		MHelpMenu,
		MIntInput
	},
	data () {
		return {
			prevMenuSelect: [],
			addDialogVisible: false,
			labelsupRules: {
				name: [
					{required: true, message: '标签名不能为空', trigger: 'blur'},
				],
			},
			labelMenuSearch:{
				name:''
			},
			tabName: 'menu',
			labelMenus:[],
			labelsup:{
				name:''
			},
			loading: false,
			labelsLoading: false,
			labelsTotal: 0,
			helpContentLoading: false,
			helpContentTotal: 0,
			currentOperate: 'add',
			selections: [],
			sortMenuJson: [],
			sortContentJson: [],
		}
	},
	computed: {},
	created (){
		this.getLabels()
	},
	methods: {
		// 添加标签方法
		onaddLabels () {
			this.labelsup = {
				name: ''
			}
			this.addDialogVisible = true;
			this.currentOperate= 'add'
		},
		// 获取标签列表
		getLabels () {
			this.labelsLoading = true
			this.$axios.get('/label').then(response => {
				const { status, data, message, total } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.labelMenus = data;
				this.labelsLoading = false
				this.labelsTotal = data.length;
			});
		},
		// 添加标签
		addLabels () {
			this.$axios.post('/label/add', this.labelsup).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('标签创建成功');
				this.addDialogVisible = false
				this.getLabels()
			})
		},
		// 更新标签
		updateLabels () {
			this.$axios.post('/label/edit/', this.labelsup).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('标签更新成功');
				this.addDialogVisible = false
				this.getLabels()
			})
		},
		// 删除标签
		deleteLabels (id) {
			this.$axios.post(`/label/delete/${id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.getLabels()
				this.$message.success('删除成功');
			})
		},
		onSubmit () {
			this.$refs['currentForm'].validate((valid) => {
				if (valid) this.currentOperate === 'add' ? this.addLabels() : this.updateLabels()
			})
		},
		rowDelete (id) {
			this.$confirm('此操作将删除该标签信息, 是否继续?', '删除标签', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deleteLabels(id)
			}).catch(() => {
				this.$message('已取消删除');
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>