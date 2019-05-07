<template>
	<div class="news-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>回复管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<el-tabs class="tabs-list">
			<el-tab-pane class="smart-widget-header" label="回复管理列表">
			<div class="smart-widget-inner">
				<div class="smart-widget-section">
					<el-form ref="searchForm" :inline="true" :model="search" class="demo-form-inline">
						<el-form-item prop="searchName">
							<el-select v-model="search.searchName" placeholder="请选择">
								<el-option
								v-for="item in commentsReplySearch"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="searchValue">
							<el-input v-model="search.searchValue" placeholder=""></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="xcommon.onSearch(search, getReplys)" type="primary" icon="el-icon-search">查询</el-button>
                            <el-button @click="$router.push({path: '/content/replys/add/'})" icon="el-icon-edit" type="primary">新增</el-button>
						</el-form-item>
					</el-form>
				</div>
                <div class="smart-widget-body">
                    <el-table :data="news" v-loading="loading" border style="width: 100%">
                        <el-table-column fixed="left" width="120" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="$router.push({path: `/content/replys/edit/${scope.row.id}`})" size="small">编辑</el-button>
                                <el-button type="text" @click="rowDelete(scope.$index)" size="small">删除</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="id" label="ID">
						</el-table-column>
						<el-table-column label="关联用户" prop="user_id">
							<!-- <template slot-scope="scope">
								<p>{{ xcommon.getStatusLabel(scope.row.opSource, newsSource) }}</p>
							</template> -->
						</el-table-column>
						<el-table-column  label="回复内容">
							<template slot-scope="scope">
								<p v-html="scope.row.content"></p>
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
					:current-page.sync="search.page"
					:page-sizes="[20, 50, 100]"
					@current-change="getReplys"
					@size-change="getReplys"
					:page-size.sync="search.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
                    </el-pagination>
                </div>
			</div>
			</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
import MPreview from '@/components/Preview'
import { commentsReplySearch, statusSelect, newsType, newsSort, newsSource,replysource } from '@/utils/search'
export default {
	name: 'ReplysManage',
	components: {
		MPreview
	},
	data () {
		return {
			commentsReplySearch,
			statusSelect,
			newsType,
			newsSort,
			newsSource,
			replysource,
			search: {
				searchName: 'ID',
				searchValue: '',
				status: '',
				categoryId: '',
				sort: 'addTime',
				opSource: '',
				page: 1,
				pageSize: 20
			},
			total: 0,
			dialogVisible: false,
			news: [],
			loading: false,
			currentIndex: '',
			current: {}
		}
	},
	created (){
		this.getReplys()
	},
	methods: {
		getReplys () {
			// const search = this.xutils.filterParam(this.search)
			// if(search.id && search.id === 'error') return this.$message.error('请输入正确的回复ID');
			this.loading = true
			this.$axios.post('/reply').then(response => {
				const {status, data, message, total} = response.data
				if(status !== 0) return this.$message.error(status);
				this.news = data
				this.loading = false
				this.total = data.length
			})
		},
		deleteReplys (index) {
			const _Replys = this.news[index]
			this.$axios.post(`/reply/delete/${_Replys.id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.getReplys()
				this.$message.success('删除成功');
			})
		},
		rowDelete (index) {
			this.$confirm('此操作将删除该回复信息, 是否继续?', '删除回复', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deleteReplys(index)
			}).catch(() => {
				this.$message('已取消删除');
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.dialog-footer {
	text-align: center;
	position: relative;
	.el-icon-d-arrow-left,
	.el-icon-d-arrow-right,
	.el-icon-delete {
		margin: 0 10px;
		color: #2baab1;
	}
	.el-icon-delete {
		position: absolute;
		right: 0px;
		top: 0px;
		color: #e36159;
		cursor: pointer;
	}
	.name {
		position: absolute;
		left: 0px;
		top: 0px;
		font-weight: 400;
		color: #666;
		font-size: 14px;
	}
}
.weibo {
	height: 300px;
	position: relative;
	iframe {
		position: absolute;
		right: 0px;
		top: 0px;
		height: 100%;
		width: 100%;
	}
}
</style>