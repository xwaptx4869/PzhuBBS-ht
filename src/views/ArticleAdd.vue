<template>
	<div class="news-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/articles/' }">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ type === 'edit' ? '编辑' : '投稿' }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">{{ type === 'edit' ? '编辑' : '投稿' }}</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="newsForm" :model="news" :rules="newsRules" label-width="180px">
						<el-form-item label="标题" prop="title">
							<el-input v-model="news.title" placeholder="请填写标题"></el-input>
						</el-form-item>
						 <el-form-item prop="labels" label="标签">
							<el-select v-model="news.labels" filterable  multiple placeholder="请选择" @change="handel">
								<el-option
								v-for="(item, index) in xcommon.arrayHandle(labels)"
								:key="index"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
                        <el-form-item prop="classifications" label="分类">
							<el-select v-model="news.classifications" filterable multiple placeholder="请选择">
								<el-option
								v-for="(item, index) in xcommon.arrayHandle(classifications)"
								:key="index"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="正文" prop="content">
							<template>
								<div ref="editorIntro" style="text-align:left"></div>
							</template>
						</el-form-item>
						<el-form-item>
							<!-- <el-button type="primary" v-if="news.status === '' || news.status === 0" :loading="loading" @click="onSubmit(0)" >存草稿</el-button> -->
                            <el-button type="primary" :loading="loading" @click="onSubmit(1)" >提交</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'NewsAdd',
	data () {
		return {
			addTopicString: '',
			news: {},
			newssearch:{

			},
			labels:[],
			classifications:[],
			value:[],
			newsRules: {
				title: [
					{required: true, message: '请输入文章标题', trigger: 'blur'},
				],
				labels: [
					{required: true, message: '请输入标签', trigger: 'blur'},
				],
				classifications: [
					{required: true, message: '请输入分类', trigger: 'blur'},
				],
				content: [
					{required: true, message: '请设置文章内容'},
				]
			},
			loading: false,
			type: 'add',
			news_id: '',
			inputVisible: false,
			inputValue: '',
			xEditor: null,
		};
	},
	computed: {
		newsPoster () {
			return this.$store.state.System.imagePath + this.news.poster
		}
	},
	created () {
		this.getLabels();
		this.getClassifis();
		if(!this.$route.path.match(new RegExp(/add/))){
			this.type = 'edit'
			this.news_id = this.$route.params.id
			this.getItemNews()
		}
	},
	mounted () {
		// 富文本编辑器使用
		this.xEditor = this.xcommon.createWangeditor(this.$refs.editorIntro, html => {
			this.news.content = html
		})
	},
	methods: {
		getItemNews () {
			this.$axios.get(`/article/${this.news_id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(message);

				this.news = data

				console.log(this.news)
				// this.news.label_ids = this.xcommon.arrayHandle(data.labels)
				// this.news.classification_ids = this.xcommon.arrayHandle(data.classifications)
				this.xEditor.txt.html(data.content)
			})
		},
		addNews () {
			this.news.label_ids = this.xutils.formatLabel(this.news.labels)
			this.news.classification_ids = this.xutils.formatLabel(this.news.classifications)
			console.log(this.news)
			this.$axios.post('/article/add', this.news).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error('创建失败，请检查参数');
				this.$message.success('创建文章成功');
				this.$router.go(-1)
			})
		},
		updateNews () {
			this.newssearch = JSON.parse(JSON.stringify(this.news))
			this.newssearch.label_ids = this.xutils.formatLabel(this.newssearch.labels)
			this.newssearch.classification_ids = this.xutils.formatLabel(this.newssearch.classifications)
			this.newssearch.article_id = this.news_id
			console.log(this.news)
			this.$axios.post('/article/edit', this.newssearch).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('更新文章成功');
				this.$router.go(-1)
			})
		},
		querySearchAsync (queryString, cb) {
			if(!queryString) return []
			this.xcommon.queryTopics(queryString).then(data => {
				cb(data)
			})
		},
		// 文件上传
		onFileUpload (elFrom) {
			this.xcommon.fileUpload(elFrom.file).then(res => {
				this.handleAvatarSuccess(res)
			})
		},
		handleAvatarSuccess (res) {
			if(res.status) return this.$message.error(res.message);
			this.news.poster = res.data;
		},
		onSubmit (status) {
			this.$refs['newsForm'].validate((valid) => {
				if (valid) this.type === 'add' ? this.addNews() : this.updateNews()
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
		handel (){
			console.log(this.news.labels)
		}
	}
}
</script>
<style lang="scss">
</style>