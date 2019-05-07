<template>
	<div id="config-center">
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<div class="smart-widget-section">
					<el-form ref="listSearchForm" :inline="true" class="demo-form-inline">
						<el-form-item>
							<el-input placeholder="请输入ID/配置键/工程名" v-model="search.condition"/>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
							<el-button icon="el-icon-edit" type="primary" @click="edit">新增配置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="smart-widget-body">
					<el-table :data="configlist" v-loading="loading" border style="width: 100%">
						<el-table-column fixed="left" width="120" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="edit(scope.$index,1)" size="small">编辑</el-button>
								<el-button type="text" @click="rowDelete(scope.$index)" size="small">删除</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="application" label="工程名称"/>
						<el-table-column prop="editFlag" label="编辑标识"/>
						<el-table-column prop="id" label="ID"/>
						<el-table-column prop="key" label="配置键"/>
						<el-table-column prop="value" label="配置值"/>
						<el-table-column prop="label" label="分支名称"/>
						<el-table-column prop="paramDesc" label="描述"/>
						<el-table-column prop="profile" label="环境名称"/>
					</el-table>
				</div>
				<div class="smart-widget-footer">
					<el-pagination
						:current-page.sync="search.page"
						:page-sizes="[20, 50, 100]"
						@current-change="getList"
						@size-change="getList"
						:total="total"
						:page-size.sync="search.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
					></el-pagination>
				</div>
			</div>
		</div>
		<el-dialog title="配置详情" :visible.sync="isVisible" width="500px" class="dialog-box">
			<el-form
				:model="updateConfig"
				ref="configform"
				:rules="rules"
				label-width="100px"
				:style="{width:'400px'}"
			>
				<el-form-item prop="application" label="工程名称：">
					<el-select v-model="updateConfig.application" placeholder="请选择">
						<el-option v-for="(item,index) in configDefaultList" :key="index" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="key" label="配置键：">
					<el-input v-model="updateConfig.key" :disabled="configkey" placeholder></el-input>
				</el-form-item>
				<el-form-item prop="value" label="配置值：">
					<el-input type="textarea" rows="4" v-model="updateConfig.value" placeholder></el-input>
				</el-form-item>
				<el-form-item prop="label" label="分支名称：">
					<el-input v-model="updateConfig.label" :disabled="true" placeholder></el-input>
				</el-form-item>
				<el-form-item prop="paramDesc" label="描述：">
					<el-input type="textarea" rows="4" v-model="updateConfig.paramDesc" placeholder="配置键、配置值等描述信息"></el-input>
				</el-form-item>
				<el-form-item label>
					<el-button type="primary" @click="onSubmit()">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'configcenter',
	data () {
		return {
			isVisible: false,
			currentOperate: 'add',
			applications: [],
			search: {
				page: 1,
				pageSize: 20,
				condition: ''
			},
			loading: true,
			configkey: false,
			configlist: [],
			configDefaultList: [],
			total: 0,
			updateConfig: {
				application: '',
				editFlag: '',
				id: '',
				key: '',
				label: 'master',
				paramDesc: '',
				profile: '',
				value: '',
				userId: ''
			},
			rules: {
				application: [
					{ required: true, message: '请输入工程名称', trigger: 'blur' }
				],
				editFlag: [
					{
						type: 'number',
						required: true,
						message: '请输入数字编辑标识',
						trigger: 'blur'
					}
				],
				id: [
					{
						type: 'number',
						required: true,
						message: '请输入数字ID',
						trigger: 'blur'
					}
				],
				key: [{ required: true, message: '请输入配置键', trigger: 'blur' }],
				label: [{ required: true, message: '请输入分支名称', trigger: 'blur' }],
				paramDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
				profile: [
					{ required: true, message: '请输入环境名称', trigger: 'blur' }
				],
				value: [{ required: true, message: '请输入配置值', trigger: 'blur' }]
			}
		};
	},
	created () {
		this.getList();
		this.updateConfig.userId = this.$store.state.User.userInfo.id;
	},
	methods: {
		getList () {
			const search = this.xutils.filterParam(this.search);
			if (search.condition && search.condition === 'error')
				return this.$message.error('请输入正确查询条件');
			this.loading = true;
			this.$axios.post('/config/search', search).then(response => {
				const { code, applications, data, message, total } = response.data;
				if (code !== 0) return this.$message.error(message);
				this.configlist = data;
				this.applications = applications;
				this.loading = false;
				this.total = total;
			});
		},
		edit (index, status) {
			this.isVisible = true;
			this.$axios.get('/config/add/pretreatment').then(response => {
				const { code, data, message, total } = response.data;
				if (code !== 0) {
					return this.$message.error(message);
				}
				this.configDefaultList = data;
			});
			if (status !== 1) {
				this.configkey = false;
				this.currentOperate = 'add';
				this.updateConfig.application = '';
				this.updateConfig.key = '';
				this.updateConfig.value = '';
				this.updateConfig.paramDesc = '';
			} else {
				this.configkey = true;
				this.currentOperate = 'edit';
				const _configlist = JSON.parse(JSON.stringify(this.configlist[index]));
				this.updateConfig = Object.assign(this.updateConfig, _configlist);
			}
		},
		update () {
			const list = JSON.parse(JSON.stringify(this.updateConfig));
			this.$axios.post(`/config/update/${list.id}`, list).then(response => {
				const { code, data, message } = response.data;
				if (code !== 0) return this.$message.error(message);
				this.isVisible = false;
				this.getList();
				this.$message.success('更新成功');
			});
		},
		updatenew () {
			const list = JSON.parse(JSON.stringify(this.updateConfig));
			this.$axios.post('/config/add', list).then(response => {
				const { code, data, message } = response.data;
				if (code !== 0) return this.$message.error(message);
				this.isVisible = false;
				this.getList();
				this.$message.success('添加成功');
			});
		},
		onSubmit () {
			this.$refs['configform'].validate(valid => {
				if (valid)
					this.currentOperate === 'add' ? this.updatenew() : this.update();
			});
		},
		deleteConfig (index) {
			const _configlist = this.configlist[index];
			const list = JSON.parse(JSON.stringify(this.updateConfig));
			this.$axios
				.post(`/config/delete/${_configlist.id}`, { userId: list.userId })
				.then(response => {
					const { code, data, message } = response.data;
					if (code !== 0) return this.$message.error(message);
					this.getList();
					this.$message.success('删除成功');
			});
		},
		rowDelete (index) {
			this.$confirm('此操作将删除该条配置, 是否继续?', '删除配置', {
				type: 'warning',
				center: true
			})
				.then(() => {
					this.deleteConfig(index);
				})
				.catch(() => {
					this.$message('已取消删除');
			});
		}
	}
};
</script>

<style lang="scss">
.dialog-box .el-select > .el-input {
  display: block;
  width: 300px;
}
</style>