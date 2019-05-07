<template>
	<div class="help-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>院系信息管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<el-tabs class="tabs-list" v-model="tabName">
					<el-tab-pane label="院系信息管理" name="menu">
						<div class="smart-widget-section">
							<el-form ref="searchForm" :inline="true" :model="labelMenuSearch" class="demo-form-inline">
								<el-form-item prop="title" label="院系信息名">
									<el-input v-model="labelMenuSearch.name" placeholder></el-input>
								</el-form-item>
								<el-form-item>
									<el-button
										type="primary"
										@click="xcommon.onSearch(labelMenuSearch, getLabels)"
										icon="el-icon-search"
									>查询</el-button>
									<el-button icon="el-icon-edit" @click="onaddLabels" type="primary">新建</el-button>
								</el-form-item>
							</el-form>
						</div>
						<div class="smart-widget-body">
							<el-table :data="labelMenus" v-loading="labelsLoading" border style="width: 100%">
								<el-table-column fixed="left" width="120" label="操作">
									<template slot-scope="scope">
										<el-button
											type="text"
											@click="addDialogVisible = true;currentOperate='edit';labelsup =JSON.parse(JSON.stringify(scope.row))"
											size="small"
										>编辑</el-button>
										<el-button type="text" @click="rowDelete(scope.row.id)" size="small">删除</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="id" label="ID"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="college" label="学院"></el-table-column>
								<el-table-column :show-overflow-tooltip="true" prop="major" label="专业"></el-table-column>
								<el-table-column label="创建时间">
									<template slot-scope="scope">
										<p>{{ `${xutils.formatTime(scope.row.created_at)}` }}</p>
									</template>
								</el-table-column>
								<el-table-column label="更新时间">
									<template slot-scope="scope">
										<p>{{ `${xutils.formatTime(scope.row.updated_at)}` }}</p>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="smart-widget-footer">
							<el-pagination
								:page-sizes="[20, 50, 100]"
								@current-change="getLabels"
								@size-change="getLabels"
								:page-size.sync="labelsup.pageSize"
								:current-page.sync="labelsup.page"
								layout="total, sizes, prev, pager, next, jumper"
								:total="labelsTotal"
							></el-pagination>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<!-- 批量删除 -->
		<el-dialog
			:title="currentOperate === 'edit' ? '院系信息编辑': '院系信息新建'"
			:visible.sync="addDialogVisible"
			width="450px"
		>
			<div class="comment-detail dialog-content">
				<el-form ref="currentForm" :model="labelsup" :rules="labelsupRules" label-width="80px">
					<el-form-item prop="college" label="院系">
						<el-input v-model="labelsup.college" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item prop="major" label="专业">
						<el-input v-model="labelsup.major"></el-input>
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
import MHelpMenu from '@/components/HelpMenu';
import MIntInput from '@/components/IntInput';
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
					{ required: true, message: '院系信息名不能为空', trigger: 'blur' }
				],
				college: [{ required: true, message: 'p_id不能为空', trigger: 'blur' }],
				major: [{ required: true, message: 'd_id不能为空', trigger: 'blur' }]
			},
			labelMenuSearch: {
				name: ''
			},
			tabName: 'menu',
			labelMenus: [],
			labelsup: {
				name: '',
				major: '',
				college: '',
				pageSize: 20,
				page: 1
			},
			loading: false,
			labelsLoading: false,
			labelsTotal: 0,
			helpContentLoading: false,
			helpContentTotal: 0,
			currentOperate: 'add',
			selections: [],
			sortMenuJson: [],
			sortContentJson: []
		};
	},
	computed: {},
	created () {
		this.getLabels();
	},
	methods: {
		// 添加院系信息方法
		onaddLabels () {
			this.labelsup = {
				name: '',
				d_id: '',
				p_id: ''
			};
			this.addDialogVisible = true;
			this.currentOperate = 'add';
		},
		// 获取院系信息列表
		getLabels () {
			this.labelsLoading = true;
			this.$axios.post('/collegemsg').then(response => {
				const { status, data, message, total } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.labelMenus = data;
				this.labelsLoading = false;
				this.labelsTotal = data.length;
			});
		},
		// 添加院系信息
		addLabels () {
			this.$axios.post('/collegemsg/add', this.labelsup).then(response => {
				const { status, data, message } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.$message.success('院系信息创建成功');
				this.addDialogVisible = false;
				this.getLabels();
			});
		},
		// 更新院系信息
		updateLabels () {
			this.$axios.post('/collegemsg/edit/', this.labelsup).then(response => {
				const { status, data, message } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.$message.success('院系信息更新成功');
				this.addDialogVisible = false;
				this.getLabels();
			});
		},
		// 删除院系信息
		deleteLabels (id) {
			this.$axios.post(`/collegemsg/delete/${id}`).then(response => {
				const { status, data, message } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.getLabels();
				this.$message.success('删除成功');
			});
		},
		onSubmit () {
			this.$refs['currentForm'].validate(valid => {
				if (valid)
					this.currentOperate === 'add'
						? this.addLabels()
						: this.updateLabels();
			});
		},
		rowDelete (id) {
			this.$confirm('此操作将删除该院系信息信息, 是否继续?', '删除院系信息', {
				type: 'warning',
				center: true
			})
				.then(() => {
					this.deleteLabels(id);
				})
				.catch(() => {
					this.$message('已取消删除');
			});
		}
	}
};
</script>
<style lang="scss" scoped>
</style>