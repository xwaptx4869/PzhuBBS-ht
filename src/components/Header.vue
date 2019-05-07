<template>
	<div class="header">
		<div class="logo">pzhuBBS后台管理系统</div>
		<div class="user-info">
			<el-dropdown trigger="click" @command="handleCommand">
				<span class="el-dropdown-link">
					<img class="user-logo" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553103809439&di=606f846cac1e37ec8df0dcb345cb7146&imgtype=0&src=http%3A%2F%2Fi1.hdslb.com%2Fbfs%2Fface%2F27d449beaf64111ce7b9f58b6ad0fc097a92c283.jpg">
					<!-- {{ $store.state.User.userInfo.user_name }} -->
					许三多
					<i class="el-icon-arrow-down"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="loginout"><i class="fa fa-power-off"></i>退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Mheader',
	data () {
		return {
			// userImage:
		}
	},
	computed: {
		// userImage () {
		// 	return this.$store.state.User.userInfo.user_image
		// }
	},
	methods: {
		handleCommand (command) {
			if (command === 'loginout') {
				this.$axios.post('/logout').then(response => {
					const {code, data, message} = response.data
					if(code !== 0) return this.$message.error(message);
					this.$store.commit('LOGOUT')
					this.$router.push('/login')
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 55px;
	font-size: 20px;
	line-height: 55px;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	-moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	transition: all 0.5s ease;
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-ms-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	z-index: 9;
	.logo {
		float: left;
		width: 250px;
		text-align: center;
		font-size: 16px;
	}
	.user-info {
		float: right;
		padding-right: 50px;
		.user-status {
			display: inline-block;
			font-size: 14px;
			padding: 0 15px;
			color: #409eff;
			cursor: pointer;
			&.off {
				color: #c2c2c2;
			}
			.fa {
				margin-right: 5px;
			}
		}
		.el-dropdown-link {
			position: relative;
			display: inline-block;
			padding-left: 50px;
			cursor: pointer;
			vertical-align: middle;
		}
		.user-logo {
			position: absolute;
			left: 0;
			top: 9px;
			width: 35px;
			height: 35px;
			border-radius: 50%;
		}
	}
}
.el-dropdown-menu__item {
	text-align: center;
	line-height: 30px;
	.fa {
		margin-right: 5px;
	}
}
</style>