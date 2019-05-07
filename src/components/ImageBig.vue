<template>
	<el-dialog
    :visible.sync="visible"
    :before-close="handleClose">
        <div v-if="type === 1" class="image">
            <img :src="fileUrl" />
        </div>
		<div v-if="type === 2" class="video">
			<video :src="fileUrl" controls="controls">
			您的浏览器不支持 video 标签
			</video>
		</div>
		<div v-if="type === 4" v-html="url" class="videoCode"></div>
    </el-dialog>
</template>
<script>
export default {
	name: 'MImageBig',
	props: {
		url: String,
		type: {
			type: Number,
			default: 1
		}, // 1是图片  2 视频  4 网络视频
		visible: Boolean
	},
	data () {
		return {}
	},
	computed: {
		fileUrl () {
			return this.$store.state.System.imagePath + this.url
		}
	},
	methods: {
		handleClose () {
			this.$emit('update:visible', false)
		}
	}
}
</script>
<style lang="scss" scoped>
.image {
	text-align: center;
	img {
		max-width: 100%;
	}
}
.video {
	text-align: center;
	video {
		width: 100%;
	}
}
.videoCode {
	text-align: center;
	embed {
		width: 100%;
	}
}
</style>