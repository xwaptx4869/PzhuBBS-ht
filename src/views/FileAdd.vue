<template>
	<div class="File-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/files/' }">文件管理</el-breadcrumb-item>
                <el-breadcrumb-item>新建文件</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">新建文件</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="FileForm" :model="File" :rules="FileRules" label-width="180px">
						 <el-form-item prop="type" label="分类">
							<el-select v-model="File.type" placeholder="请选择" >
								<el-option
								v-for="(item, index) in fileclassSource"
								:key="index"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="文件" prop="small_url">
							<el-upload
                                class="avatar-uploader"
                                action="/"
                                :show-file-list="false"
                                :before-upload="xcommon.beforeAvatarUpload">
                                <i  class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
						</el-form-item>
						<el-form-item>
                            <el-button type="primary" :loading="loading" @click="onSubmit" >提交</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { FileType,fileclassSource } from '@/utils/search'
export default {
	name: 'FileAdd',
	data () {
		return {
			fileclassSource,
			addTopicString: '',
			FileType,
			File: {
				title: '',
				desc: '',
				topicIds: '',
				isHome: 0,
				type: '',
				is_update: 1,

			},
			topics: [],
			inputVisible: false,
			FileRules: {
				title: [
					{required: true, message: '请输入文件标题', trigger: 'blur'},
				],
				type: [
					{required: true, message: '请选择文件类型', trigger: 'blur'},
				],
			},
			loading: false
		};
	},
	created () {
		if(!this.$route.path.match(new RegExp(/add/))){
			this.type = 'edit'
			this.news_id = this.$route.params.id
			this.getItemNews()
		}
	},
	methods: {
		getItemNews () {
			this.$axios.get(`/file/${this.news_id}`).then(response => {
				const {status, data, message} = response.data
				if(status !== 0) return this.$message.error(status);
				data.type = data.type + ''
				this.File = data
			})
		},
		// 添加文件
		addFile () {
			this.loading = true
			const { File, topics, schedulings } = this
			File.topicIds =  this.xutils.toStringTag(topics)
			this.$axios.post('/media/group/add', File).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('创建文件成功');
				this.$router.go(-1)
				this.loading = false
			})
		},
		onSubmit () {
			this.$refs['FileForm'].validate((valid) => {
				if (valid) this.addFile()
				return false
			})
		}
	}
}
</script>
<style lang="scss">
</style>