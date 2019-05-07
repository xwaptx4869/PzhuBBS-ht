<template>
	<div class="photo-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>相册管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<el-tabs class="tabs-list" v-model="tabName">
					<el-tab-pane label="相册列表" name="list">
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
											v-for="item in searchList.photoSearch"
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
										@click="xcommon.onSearch(searchList.search, getPhotos)"
										icon="el-icon-search"
									>查询</el-button>
									<el-button
										icon="el-icon-edit"
										@click="$router.push({path: '/content/photos/add/'})"
										type="primary"
									>新增相册</el-button>
								</el-form-item>
							</el-form>
						</div>
						<div class="smart-widget-body">
							<el-table :data="photos" v-loading="searchList.loading" border style="width: 100%">
								<el-table-column fixed="left" width="120" label="操作">
									<template slot-scope="scope">
										<el-button
											type="text"
											@click="$router.push({path: `/content/photos/edit/${scope.row.id}?type=detail`})"
											size="small"
										>编辑</el-button>
										<el-button
											type="text"
											@click="rowDelete(scope.row.id)"
											size="small"
										>删除</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="id" label="ID"/>
								<el-table-column :show-overflow-tooltip="true" prop="title" label="相册名"/>
								<el-table-column label="创建时间">
									<template slot-scope="scope">
										<p>{{ `${xutils.formatTime(scope.row.created_at)}` }}</p>
									</template>
								</el-table-column>
								<el-table-column label="资源ID列表">
									<template slot-scope="scope">
										<p>{{ `${xutils.idsArray(scope.row.file_ids)}` }}</p>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="smart-widget-footer">
							<el-pagination
								:current-page.sync="searchList.search.page"
								:page-sizes="[20, 50, 100]"
								@current-change="getPhotos"
								@size-change="getPhotos"
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
import { photoSearch, photoMenuSearch, photoState } from '@/utils/search';


export default {
	name: 'PhotoManage',
	components: {
		MIntInput
	},
	data () {
		return {
			searchList: {
				photoSearch,
				search: {
					searchName: 'title',
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
			photos: [],
			menus: [],
			menuSort: []
		};
	},
	created () {
		this.getPhotos();
	},
	methods: {
		getPhotos () {
			const { searchList } = this;
			const search = this.xutils.filterParam(searchList.search);
			if (search.id && search.id === 'error')
				return this.$message.error('请输入正确的相册ID');
			searchList.loading = true;
			this.$axios.post('/album', search).then(response => {
				const { status, data, message } = response.data;
				if (status !== 0) return this.$message.error(message);
				this.photos = data;
				searchList.loading = false;
				searchList.total = data.length;
			});
		},
		// updatePhotos (index) {
		// 	const photo = JSON.parse(JSON.stringify(this.photos[index]));
		// 	photo.status = photo.status === 1 ? -1 : 1;
		// 	this.$axios
		// 		.post(`/media/group/update/${photo.id}`, photo)
		// 		.then(response => {
		// 			const { code, data, message } = response.data;
		// 			if (code !== 0) return this.$message.error(message);
		// 			this.getPhotos();
		// 			this.$message.success('更新成功');
		// 	});
		// },
		deletePhoto (index){
			this.$axios.post(`/album/delete/${index}`).then(response =>{
				const { status, data, message } = response.data;
				if (status !== 0) return this.$message.error(message);
				this.getPhotos();
				return this.$message.success('删除成功')
			})
		},
		rowDelete (id) {
			this.$confirm('此操作将删除该相册, 是否继续?', '删除相册', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deletePhoto(id);
			}).catch(() => {
				this.$message('已取消删除');
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>