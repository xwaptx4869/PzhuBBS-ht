<template>
	<div class="login">
		<div class="login-mian">
			<div class="title">后台管理系统</div>
			<el-form ref="loginForm" :model="login" :rules="loginRules">
				<el-form-item prop="username">
					<el-input placeholder="请输入用户名" v-model="login.username" clearable></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input placeholder="请输入密码" type="password" v-model="login.password" clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="onSubmit">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import ls from 'local-storage'
export default {
	name: 'Login',
	data () {
		return {
			login: {
				username:'',
				password:''
			},
			imageCode: '',
			checked: true,
			loginRules: {
				username: [
					{required: true, message: '请输入您的账号', trigger: 'blur'},
					{ type: 'string', pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请输入正确的账号', trigger: 'blur' }
				],
				password: [
					{required: true, message: '请输入您的密码', trigger: 'blur'},
					{ type: 'string', message: '请输入正确密码', trigger: 'blur' }
				],
			},
			loading: false,
		}
	},
	created () {
		// const _token = ls.get('token')
		// if(_token) this.$router.push({path: '/content/news/'}))
	},
	methods: {
		onSubmit () {
			this.$refs['loginForm'].validate((valid) => {
				if (valid) this.snedLogin()
				// console.log('1')
				// this.$router.push({path: '/content/news/'})
			})
		},
		snedLogin () {
			// this.$axios.post('/login', this.login).then(response => {
			// 	const {code, data, message} = response.data
			// 	if(code !== 0) return this.$message.error(message);
			this.$message.success('登录成功');
			// this.$store.commit('SET_USERINFO', {user: data.user})
			// this.$store.commit('SET_TOKEN', {token: data.token})
			// this.$store.commit('SET_PERMISSIONS', {permissions: data.permissions})
			// this.$store.dispatch('getImagePath')
			this.$router.push({path:'/data/dashboard'})
			// })
		}
	}
}
</script>

<style lang="scss">
.login {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0px;
	left: 0px;
	background-color: #f0f2f4;
	.login-mian {
		width: 400px;
		margin: auto;
		padding: 80px 40px;
		position: relative;
		top: 50%;
		margin-top: -202px;
		.title {
			text-align: center;
			font-size: 20px;
			color: #333;
			margin-bottom: 30px;
			strong {
				color: #2baab1;
				font-weight: 700;
				font-size: 28px;
			}
		}
		.image-code {
			.el-input-group__append {
				padding: 0px;
				img {
					display: block;
				}
			}
		}
		.sms-code {
			cursor: pointer;
		}
		.el-form {
			width: 400px;
		}
		.el-button {
			display: block;
			width: 100%;
		}
		.password-save {
			color: #999;
			font-size: 13px;
			.el-checkbox {
				margin-right: 8px;
			}
		}
	}
}
</style>