<template>
	<div class="news-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/replys/' }">回复管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ type === 'edit' ? '编辑' : '新增' }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">{{ type === 'edit' ? '编辑' : '新增' }}</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="newsForm" :model="news" :rules="newsRules" label-width="180px">
						<el-form-item label="相关用户ID" prop="user_id">
							<el-input v-model="news.user_id" placeholder="请填写相关ID"></el-input>
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

export default {
	name: 'NewsAdd',
	data () {
		return {
			addTopicString: '',
			news: {
				user_id: '',
				content: '',
			},
			newsRules: {
				user_id: [
					{required: true, message: '请输入相关ID', trigger: 'blur'},
				],
				content: [
					{required: true, message: '请设置回复内容'},
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
			this.$axios.get(`/reply/${this.news_id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.news = data
				this.xEditor.txt.html(data.content)
			})
		},
		addNews () {
			this.$axios.post('/reply/add', this.news).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('创建回复成功');
				this.$router.go(-1)
			})
		},
		updateNews () {
			const updatenews = JSON.parse(JSON.stringify(this.news))
			updatenews.id =this.news_id
			updatenews.user_id = updatenews.user_id+''
			this.$axios.post('/reply/edit', updatenews).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				this.$message.success('更新回复成功');
				this.$router.go(-1)
			})
		},
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
		onSubmit (status) {
			this.$refs['newsForm'].validate((valid) => {
				if (valid) this.type === 'add' ? this.addNews(status) : this.updateNews(status)
			})
		},
	}
}
</script>
<style lang="scss">
</style>