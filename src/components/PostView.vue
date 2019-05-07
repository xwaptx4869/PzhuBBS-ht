<template>
	<div class="post-view">
		<div v-if="postdata.subType === 5" class="post-text">
			<div class="post-content">
				<div class="post-head">
					<div class="bg">
						<img :src="postdata.poster">
					</div>
					<div class="title">{{postdata.title}}</div>
					<div class="user">
						<img :src="postdata.avatar">
						<b>{{postdata.addUserName}}</b>
						<span>{{postdata.friendTime}}</span>
					</div>
				</div>
				<div class="post-content">
					<div v-html="postdata.content"></div>
				</div>
			</div>
		</div>
		<div v-if="postdata.subType === 4"  class="post-json" >
			<div class="post-item">
				<div class="post-user clearfix">
					<img :src="postdata.avatar" />
					<div class="text">
						<div class="name">{{ postdata.addUserName}}</div>
						<p>{{ postdata.friendTime }}</p>
					</div>
				</div>
				<div class="post-content">
					<div class="editor-text" v-if="postdata.content.text" >{{ postdata.content.text }}</div>
					<div class="editor-text" v-else v-html="postdata.content"></div>
					<div v-if="postdata.content.images" class="image-box clearfix">
						<img v-for="(img, index) in postdata.content.images" :key="index" :src="img" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PostView',
	props: {
		pid: [Number, String],
	},
	data () {
		return {
			serachId: '',
			postdata: {
				ownerDetail: {},
			}
		};
	},
	watch: {
		pid (id) {
			this.serachId = id;
			this.getPost();
		}
	},
	created (){
		this.serachId = this.pid
		this.getPost();
	},
	methods: {
		getPost () {
			this.$axios
				.get(`/posts/${this.serachId}`)
				.then(response => {
					const { code, data, message } = response.data;
					if (code !== 0) return this.$message.error(message);
					if(data.subType === 4){
						data.content = JSON.parse(data.content)
					}
					this.postdata = data;
			});
		}
	}
};
</script>
<style lang="scss">
.post-view {
	height: 400px;
	overflow: auto;
}
.post-text {
	.post-content {
		position: relative;
		z-index: 11;
		.post-head {
			position: relative;
			height: 250px;
			.bg {
				position: absolute;
				width: 100%;
				height: 100%;
				overflow: hidden;
				z-index: -10;
				img {
					width: 100%;
				}
				&::after {
					content: "";
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.4);
					top: 0px;
					left: 0px;
				}
			}
			.title {
				font-size: 30px;
				color: #ffffff;
				letter-spacing: 0;
				line-height: 60px;
				position: absolute;
				bottom: 80px;
				left: 30px;
				right: 30px;
			}
			.user {
				line-height: 44px;
				position: absolute;
				bottom: 20px;
				left: 30px;
				right: 30px;
				height: 44px;
				overflow: hidden;
				img {
					width: 44px;
					height: 44px;
					border-radius: 50%;
					vertical-align: middle;
					float: left;
				}
				b {
					font-size: 18px;
					color: #fff;
					font-weight: 600;
					margin-left: 15px;
				}
				span {
					font-size: 14px;
					color: #cccccc;
					margin-left: 30px;
				}
			}
		}
		.post-content {
			padding: 30px;
			font-size: 20px;
			color: #666666;
			line-height: 40px;
			background: #fff;
			img {
				width: 100%;
				height: auto !important;
				margin-top: 30px;
			}
			embed,video{
				max-width: 100%;
				height: auto !important;
			}
		}
		.topic-list {
			margin: 0 30px;
		}
	}
}

.post-item {
	padding: 20px;
	.post-user {
		height: 44px;
		overflow: hidden;
		img {
			width: 44px;
			height: 44px;
			border-radius: 50%;
			float: left;
		}
		.text {
			margin-left: 15px;
			float: left;
			.name {
				font-size: 18px;
				color: #191919;
				line-height: 28px;
				font-weight: 600;
			}
			p {
				font-size: 14px;
				color: #999999;
				line-height: 16px;
			}
		}
	}
	.post-content {
		padding-top: 20px;
		font-size: 20px;
		line-height: 40px;
		color: #666666;
		.image-box {
			margin-top: 20px;
			img {
				width: 45%;
				margin-right: 5%;
				border-radius: 16px;
				vertical-align: top;
				float: left;
				margin-bottom: 15px;
			}
		}
		.video-box {
			margin-top: 20px;
			video {
				width: 100%;
				border-radius: 16px;
				overflow: hidden;
			}
		}
	}
}
</style>