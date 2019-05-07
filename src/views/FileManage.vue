<template>
	<div class="photo-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>文件管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<el-tabs class="tabs-list" v-model="tabName">
					<el-tab-pane label="文件列表" name="list">
						<div class="smart-widget-section">
							<el-form
								ref="listSearchForm"
								:inline="true"
								:model="searchList.search"
								class="demo-form-inline"
							>
								<el-form-item prop="searchName">
									<el-select v-model="searchList.search.searchName" placeholder="请选择">
										<el-option
											v-for="item in searchList.fileSource"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
								<el-form-item prop="searchValue">
									<el-input v-model="searchList.search.searchValue" placeholder/>
								</el-form-item>
								<el-form-item>
									<el-button
										type="primary"
										@click="xcommon.onSearch(searchList.search, getFiles)"
										icon="el-icon-search"
									>查询</el-button>
									<el-button
										icon="el-icon-edit"
										@click="$router.push({path: '/content/files/add/'})"
										type="primary"
									>新增文件</el-button>
								</el-form-item>
							</el-form>
						</div>
						<div class="smart-widget-body">
							<el-table :data="Files" v-loading="searchList.loading" border style="width: 100%">
								<el-table-column fixed="left" width="120" label="操作">
									<template slot-scope="scope">
										<el-button
											type="text"
											@click="$router.push({path: `/content/files/edit/${scope.row.id}`})"
											size="small"
										>编辑</el-button>
										<el-button
											type="text"
											@click="rowDelete(scope.$index)"
											size="small"
										>删除</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="id" label="ID"/>
								<el-table-column :show-overflow-tooltip="true" prop="file_src" label="文件名"/>
								<el-table-column :show-overflow-tooltip="true"  label="文件类型">
								<template slot-scope="scope">
										<p>{{ `${xcommon.fileshandle(scope.row.type)}` }}</p>
									</template>
								</el-table-column>
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
								:current-page.sync="searchList.search.page"
								:page-sizes="[20, 50, 100]"
								@current-change="getFiles"
								@size-change="getFiles"
								:page-size.sync="searchList.search.pageSize"
								layout="total, sizes, prev, pager, next, jumper"
								:total="searchList.total"
							></el-pagination>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import MIntInput from '@/components/IntInput'
import { fileSource, photoMenuSearch, photoState } from '@/utils/search';
export default {
	name: 'PhotoManage',
	components: {
		MIntInput
	},
	data () {
		return {
			searchList: {
				fileSource,
				search: {
					searchName: 'ID',
					searchValue: '',
					page: 1,
					pageSize: 20
				},
				total: 0,
				loading: false
			},
			searchMenu: {
				photoMenuSearch,
				photoState,
				search: {
					searchName: 'name',
					searchValue: '',
					status: '',
					page: 1,
					pageSize: 20
				},
				total: 0,
				loading: true
			},
			tabName: 'list',
			Files: [],
			menus: [],
			menuSort: []
		};
	},
	created () {
		this.getFiles();
	},
	methods: {
		getFiles () {
			const { searchList } = this;
			searchList.loading = true;
			this.$axios.post('/file').then(response => {
				const { status, data, message, total } = response.data;
				if (status !== 0) return this.$message.error(status);
				this.Files = data;
				searchList.loading = false;
				searchList.total = data.length;
			});
		},
		deleteFiles (index) {
			const _files = this.Files[index]
			this.$axios.post(`/file/delete/${_files.id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(message);
				this.getFiles()
				this.$message.success('删除成功');
			})
		},
		rowDelete (index) {
			this.$confirm('此操作将删除该文件信息, 是否继续?', '删除文件', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deleteFiles(index)
			}).catch(() => {
				this.$message('已取消删除');
			})
		}
	}
};
</script>
<style lang="scss" scoped>
</style>