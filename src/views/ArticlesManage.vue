<template>
	<div class="news-manage">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>文章管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<el-tabs class="tabs-list">
			<el-tab-pane class="smart-widget-header" label="文章管理列表">
			<div class="smart-widget-inner">
				<div class="smart-widget-section">
					<el-form ref="searchForm" :inline="true" :model="search" class="demo-form-inline">
						<el-form-item prop="searchName">
							<el-select v-model="search.searchName" placeholder="请选择">
								<el-option
								v-for="item in newsSearch"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="searchValue">
							<el-input v-model="search.searchValue" placeholder=""></el-input>
						</el-form-item>
                        <el-form-item prop="labels" label="标签">
							<el-select v-model="search.labels" filterable multiple placeholder="请选择">
								<el-option
								v-for="(item, index) in xcommon.arrayHandle(labels)"
								:key="index"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
                        <el-form-item prop="classifications" label="分类">
							<el-select v-model="search.classifications" filterable multiple placeholder="请选择">
								<el-option
								v-for="(item, index) in xcommon.arrayHandle(classifications)"
								:key="index"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="xcommon.onSearch(search, getArticles)" type="primary" icon="el-icon-search">查询</el-button>
                            <el-button @click="$router.push({path: '/content/articles/add/'})" icon="el-icon-edit" type="primary">投稿</el-button>
						</el-form-item>
					</el-form>
				</div>
                <div class="smart-widget-body">
                    <el-table :data="news" v-loading="loading" border style="width: 100%">
                        <el-table-column fixed="left" width="120" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="$router.push({path: `/content/articles/edit/${scope.row.article_id}`})" size="small">编辑</el-button>
                                <el-button type="text" @click="rowDelete(scope.$index)" size="small">删除</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="classification_ids" label="标签">
							<template slot-scope="scope">
								<p>{{ xcommon.getclassification(scope.row.labels) }}</p>
							</template>
						</el-table-column>
						<el-table-column prop="classification_ids" label="分类">
							<template slot-scope="scope">
								<p>{{ xcommon.getclassification(scope.row.classifications) }}</p>
							</template>
						</el-table-column>
						<el-table-column prop="article_id" label="ID">
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="title" label="标题">
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
                        <el-table-column prop="praise" label="点赞数">
						</el-table-column>
                        <el-table-column prop="comment_num" label="评论数">
						</el-table-column>
                        <el-table-column prop="browse_num" label="收藏数">
						</el-table-column>
					</el-table>
                </div>
                <div class="smart-widget-footer">
                    <el-pagination
					:current-page.sync="search.page"
					:page-sizes="[20, 50, 100]"
					@current-change="getArticles"
					@size-change="getArticles"
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
import { newsSearch, statusSelect, newsType, newsSort, newsSource } from '@/utils/search'
export default {
	name: 'ArticlesManage',
	components: {
		MPreview
	},
	data () {
		return {
			newsSearch,
			statusSelect,
			newsType,
			newsSort,
			newsSource,
			search: {
				searchName: 'title',
				searchValue: '',
				labels: [],
				classifications: [],
				sort: 'addTime',
				opSource: '',
				page: 1,
				pageSize: 20
			},
			total: 0,
			dialogVisible: false,
			news: [],
			labels:[],
			classifications:[],
			loading: false,
			currentIndex: '',
			current: {}
		}
	},
	created (){
		this.getArticles()
		this.$nextTick( () =>{
			this.getLabels()
			this.getClassifis()
		})
	},
	methods: {
		resetSearchForm () {
			this.search.page = 1
			this.$refs.searchForm.resetFields()
			this.getarticles()
		},
		getArticles () {
			const search = this.xutils.filterParam(this.search)
			if(search.id && search.id === 'error') return this.$message.error('请输入正确的文章ID');
			this.loading = true
			this.$axios.get('/article', search).then(response => {
				const {status, data, message, total} = response.data
				if(status !== 0) return this.$message.error(status);
				this.news = data.rows
				this.loading = false
				this.total = data.count
			})
		},
		getLabels () {
			this.$axios.get('/label').then(response => {
				const {status, data, message, total} = response.data
				if(status !== 0) return this.$message.error(message);
				this.labels = data
			})
		},
		getClassifis () {
			this.$axios.post('/classifications').then(response => {
				const {status, data, message, total} = response.data
				if(status !== 0) return this.$message.error(message);
				this.classifications = data
			})
		},
		updateArticles (index) {
			const _articles = this.news[index]
			_news.state = 2
			this.$axios.post(`/article/update/${_news.id}`, _news).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.getarticles()
				this.$message.success('更新成功');
			})
		},
		deleteArticles (index) {
			const _articles = this.news[index]
			this.$axios.post(`/article/delete/${_articles.article_id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(message);
				this.getArticles()
				this.$message.success('删除成功');
			})
		},
		submitForm () {
			this.$refs.searchForm.validate((valid) => {
				if (valid) this.getarticles()
			});
		},
		rowDelete (index) {
			this.$confirm('此操作将删除该文章信息, 是否继续?', '删除文章', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deleteArticles(index)
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