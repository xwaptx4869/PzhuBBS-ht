<template>
	<div class="photo-editor">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/content/photos/' }">相册管理</el-breadcrumb-item>
				<el-breadcrumb-item>相册编辑</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="smart-widget">
			<div class="smart-widget-inner">
				<el-tabs class="tabs-list" v-model="activeName">
					<el-tab-pane label="相册资料" name="detail">
						<div class="smart-widget-body">
							<el-form ref="photoForm" :model="photo" :rules="photoRules" label-width="180px">
								<el-form-item label="标题" prop="title">
									<el-input v-model="photo.title" placeholder="请填写标题"></el-input>
								</el-form-item>
								<el-form-item label="相册类型" >
									<el-select v-model="photo.type" :disabled="!photo.is_update" placeholder="请选择">
										<el-option
										v-for="item in photoType"
										:key="item.value"
										:label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-form>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<m-image-big
			:type="currentShowImage.type"
			:url="currentShowImage.url"
			:visible.sync="showImageBig" >
		</m-image-big>
		<!-- 编辑图册 -->
		<el-dialog
			title="编辑"
			:visible.sync="fileDialogVisible"
			width="450px">
			<div class="dialog-content">
				<el-form ref="currentForm" :model="currentFile" :rules="fileRules" label-width="100px">
					<el-form-item prop="name" label="标题">
						<el-input v-model="currentFile.name"></el-input>
					</el-form-item>
					<el-form-item label="设置为封面">
						<el-switch :active-value="1" @change="onPoster" :inactive-value="0" v-model="currentFile.isPoster"></el-switch>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updateFile">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { photoType } from '@/utils/search'
import MImageBig from '@/components/ImageBig'
export default {
	name: 'PhotoEditor',
	components: {
		MImageBig
	},
	data () {
		return {
			addTopicString: '',
			showImageBig: false,
			currentShowImage: {},
			currentFile: {},
			photoType,
			photo: {
				title: '',
				desc: '',
				topicIds: '',
				type: '',
				is_update: 1,
				// schedulingIds: '',
				// schedulings: [],
				topics: [],
			},
			activeName: 'detail',
			// inputSchedulingVisible: false,
			inputVisible: false,
			fileDialogVisible: false,
			photoRules: {
				title: [
					{
						required: true,
						message: '请输入相册标题',
						trigger: 'blur'
					}
				]
			},
			fileRules: {
				name: [
					{
						required: true,
						message: '请输入图册标题',
						trigger: 'blur'
					}
				]
			},
			photoLoading: false,
			loading: false,
			total: 0,
			pageSize: 20,
			page: 1,
			files: [],
			photoId: ''
		};
	},
	created () {
		this.activeName = this.$route.query.type;
		this.photoId = this.$route.params.id
		this.getPhoto()
		this.getFiles()
	},
	methods: {
		// 确认是否设置封面
		onPoster () {
			if(this.currentFile.isPoster === 0) return false
			this.$axios.get(`/media/getPoster/${this.photoId}`).then(response => {
				const {code, data, message, state} = response.data
				if(code !== 0) return this.$message.error(message);
				if(!data.id) return false
				this.$confirm('将此设为封面，并且取消原封面?', '重设封面', {
					type: 'warning',
					center: true
				}).then(() => {}).catch(() => {
					this.currentFile.isPoster = 0
				})
			})
		},
		// 获取相册
		getPhoto () {
			this.$axios.get(`/media/group/${this.photoId}`).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				data.schedulings = data.schedulings ? data.schedulings : []
				data.topics = data.topics ? data.topics : []
				this.photo = data
			})
		},
		// 删除文件
		deleteFile (id) {
			this.$axios.post(`/media/delete/${id}`).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.getFiles()
				this.$message.success('删除成功');
			})
		},
		rowDelete (id) {
			this.$confirm('此操作将删除该图册信息, 是否继续?', '删除图册', {
				type: 'warning',
				center: true
			}).then(() => {
				this.deleteFile(id)
			}).catch(() => {
				this.$message('已取消删除');
			})
		},
		// 更新相册详情
		updatePhoto () {
			this.photoLoading = true
			const { photo } = this
			photo.topicIds =  this.xutils.toStringTag(photo.topics)
			photo.schedulingIds =  this.xutils.toStringTag(photo.schedulings)
			this.$axios.post(`/media/group/update/${this.photoId}`, photo).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('更新相册成功');
				this.$router.go(-1)
				this.photoLoading = false
			})
		},
		// 获取图册列表
		getFiles () {
			this.loading = true
			this.$axios.post('/media', {groupId: this.photoId, page: this.page, pageSize: this.pageSize}).then(response => {
				const {code, data, message, total} = response.data
				if(code !== 0) return this.$message.error(message);
				this.files = data
				this.total = total
				this.loading = false
			})
		},
		onSubmit () {
			this.$refs['photoForm'].validate(valid => {
				if (valid) this.updatePhoto()
				return false;
			});
		},
		// 显示tag输入框
		showInput () {
			if(this.photo.topics.length >= 2) return this.$message.error('最多关联2个话题');
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		// 查询行程数据
		querySchedulingSearchAsync (queryString, cb) {
			if (!queryString) return [];
			this.xcommon.querySchedulings(queryString).then(data => {
				cb(data);
			});
		},
		// 查询话题数据
		querySearchAsync (queryString, cb) {
			if (!queryString) return [];
			this.xcommon.queryTopics(queryString).then(data => {
				cb(data);
			});
		},
		// 设置tag数据
		handleSelect (key, visible, item) {
			// 验证tag添加是否重复
			if (!this.xutils.isTagRepeat(this.photo[key], item)) return this.$message.success('已关联该话题');
			this.photo[key].push(item);
			this[visible] = false;
		},
		// 更新图册属性
		updateFile () {
			this.$refs['currentForm'].validate(valid => {
				if (valid) {
					this.$axios.post(`/media/update/${this.currentFile.id}`, this.currentFile).then(response => {
						const {code, data, message} = response.data
						if(code !== 0) return this.$message.error(message);
						this.$message.success('更新图册成功');
						this.fileDialogVisible = false
						this.getFiles()
					})
				}
				return false;
			});
		}
	}
};
</script>
<style lang="scss">
</style>