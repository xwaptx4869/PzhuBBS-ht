<template>
	<div class="news-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/comments/' }">评论管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ type === 'edit' ? '编辑' : '新增' }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">{{ type === 'edit' ? '编辑' : '新增' }}</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="newsForm" :model="news" :rules="newsRules" label-width="180px">
						<el-form-item label="关联ID" prop="connect_id">
							<el-input v-model="news.connect_id" placeholder="请填写相关ID"></el-input>
						</el-form-item>
                        <el-form-item prop="type" label="分类">
							<el-select v-model="news.type" placeholder="请选择">
								<el-option
								v-for="(item, index) in commentSource"
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
                            <el-button type="primary" :loading="loading" @click="onSubmit()" >提交</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { newsSearch, statusSelect, newsType, newsSort, newsSource,commentSource } from '@/utils/search'
export default {
	name: 'NewsAdd',
	data () {
		return {
			addTopicString: '',
			news: {
				type: '',
				connect_id: '',
				content: ''
			},
			newsRules: {
				connect_id: [
					{required: true, message: '请输入相关ID', trigger: 'blur'},
				],
				type: [
					{required: true, message: '请输入分类', trigger: 'blur'},
				],
				content: [
					{required: true, message: '请设置评论内容'},
				]
			},
			loading: false,
			type: 'add',
			news_id: '',
			inputVisible: false,
			inputValue: '',
			xEditor: null,
			commentSource
		};
	},
	computed: {
		newsPoster () {
			return this.$store.state.System.imagePath + this.news.poster
		}
	},
	created () {
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
			this.$axios.get(`/comment/${this.news_id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				data.type = data.type.toString();
				this.news = data
				this.xEditor.txt.html(data.content)
			})
		},
		handle (){
			console.log(this.news)
		},
		addComments () {
			this.$axios.post('/comment/add', this.news).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('创建评论成功');
				this.$router.go(-1)
			})
		},
		updateComments () {
			const newcomment = this.xcommon.upcommentRule(newcomment,this.news,this.news_id)
			this.$axios.post('/comment/edit',newcomment).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('更新评论成功');
				this.$router.go(-1)
			})
		},
		// querySearchAsync (queryString, cb) {
		// 	if(!queryString) return []
		// 	this.xcommon.queryTopics(queryString).then(data => {
		// 		cb(data)
		// 	})
		// },
		// 文件上传
		onFileUpload (elFrom) {
			this.xcommon.fileUpload(elFrom.file).then(res => {
				this.handleAvatarSuccess(res)
			})
		},
		handleAvatarSuccess (res) {
			if(res.code) return this.$message.error(res.message);
			this.news.poster = res.data;
		},
		onSubmit () {
			this.$refs['newsForm'].validate((valid) => {
				if (valid) this.type === 'add' ? this.addComments() : this.updateComments()
			})
		}
	}
}
</script>
<style lang="scss">
</style>