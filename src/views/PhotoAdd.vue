<template>
	<div class="photo-add">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/photos/' }">相册管理</el-breadcrumb-item>
                <el-breadcrumb-item>新建相册</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-header">新建相册</div>
			<div class="smart-widget-inner">
				<div class="smart-widget-body">
					<el-form ref="photoForm" :model="photo" :rules="photoRules" label-width="180px">
						<el-form-item label="标题" prop="title">
							<el-input v-model="photo.title" placeholder="请填写标题"></el-input>
						</el-form-item>
						<el-form-item label="封面" prop="picUrl">
							<el-upload
                                class="avatar-uploader"
                                action="/"
								:limit="1"
								:show-file-list="false"
								:http-request="onFileUpload"
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
import { photoType } from '@/utils/search'
export default {
	name: 'PhotoAdd',
	data () {
		return {
			addTopicString: '',
			photoType,
			photo: {
				title: '',
				desc: '',
				topicIds: '',
				isHome: 0,
				type: '',
				is_update: 1,
				picUrl:''

			},
			topics: [],
			inputVisible: false,
			photoRules: {
				title: [
					{required: true, message: '请输入相册标题', trigger: 'blur'},
				],
				poster: [
					{required: true, message: '请选择相册封面', trigger: 'blur'},
				],
			},
			loading: false
		};
	},
	methods: {
		// 添加相册
		addPhoto () {
			this.loading = true
			const { photo, topics, schedulings } = this
			photo.topicIds =  this.xutils.toStringTag(topics)
			this.$axios.post('/media/group/add', photo).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('创建相册成功');
				this.$router.go(-1)
				this.loading = false
			})
		},
		// 图片
		picSuccess (res, file) {
			if(res.code) return this.$message.success(res.message);
			this.photo.picUrl = res.data;
			console.log(this.photo.picUrl)
		},
		// 文件上传
		onFileUpload (elFrom) {
			this.xcommon.fileUpload(elFrom.file).then(res => {
				this.picSuccess(res)
			})
		},
		onSubmit () {
			this.$refs['photoForm'].validate((valid) => {
				if (valid) this.addPhoto()
				return false
			})
		}
	}
}
</script>
<style lang="scss">
</style>