<template>
	<el-dialog
        :title="title"
        :visible.sync="isVisible"
        :before-close="handleClose"
        width="500px">
        <div class="weibo">
			<iframe v-if="type === 4" :src="`https://m.weibo.cn/detail/${uid}`"></iframe>
            <iframe v-if="type === 1" :src="`${$store.state.System.wapPath}/#/news/${uid}`"></iframe>
			<post-view  v-if="type === 2" :pid="uid"></post-view>
			<iframe v-if="type === 3" :src="`${$store.state.System.wapPath}/#/scheduling/${uid}`"></iframe>
        </div>
        <div slot="footer" class="dialog-footer">
            <span class="name">ID:{{ uid }}</span>
            <i @click="onPrev()" class="el-icon-d-arrow-left"></i>
            <i @click="onNext()" class="el-icon-d-arrow-right"></i>
			<span v-if="isStickie" class="set-top">置顶</span>
            <i v-if="isDelete" @click="onDelete()" class="el-icon-delete"></i>
        </div>
    </el-dialog>
</template>
<script>
import PostView from '@/components/PostView'
export default {
	name: 'MPreview',
	components: {
		PostView
	},
	props: {
		uid: Number,
		isVisible: Boolean,
		title: {
			type: String,
			default: '预览'
		},
		isStickie: {
			type: Boolean,
			default: false
		},
		isDelete: {
			type: Boolean,
			default: true
		},
		type: Number		// 1 新闻   2 帖子   3 行程  4 微博
	},
	methods: {
		onNext () {
			this.$emit('on-page', 'next')
		},
		onPrev () {
			this.$emit('on-page', 'prev')
		},
		onDelete () {
			this.$emit('update:isVisible', false)
			this.$emit('on-delete')
		},
		handleClose () {
			this.$emit('update:isVisible', false)
		}
	}
}
</script>
<style lang="scss" scoped>
.weibo {
	height: 450px;
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