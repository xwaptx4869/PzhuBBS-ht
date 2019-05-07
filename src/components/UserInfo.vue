<template>
	<el-dialog
        title="用户信息"
        :visible="isVisible"
        :before-close="handleClose"
        width="400px">
        <div class="user-info dialog-content">
            <table>
                <tr>
                    <td>id编号：</td>
                    <td colspan="3">{{ userJson.id }}</td>
                </tr>
                <tr>
                    <td>用户名字：</td>
                    <td colspan="3">{{ userJson.user_name }}</td>
                </tr>
                <tr>
                    <td>电话：</td>
                    <td colspan="3">{{ userJson.phone }}</td>
                </tr>
                <tr>
                    <td>性别：</td>
                    <td>{{ sexs[userJson.sex - 1] }}</td>
                    <td>年龄：</td>
                    <td>{{ userJson.age }}</td>
                </tr>
                <tr>
                    <td>等级：</td>
                    <td>{{ userJson.level }}</td>
                    <td>人气：</td>
                    <td>{{ userJson.popularity }}</td>
                </tr>
                <tr>
                    <td>城市：</td>
                    <td colspan="3">{{ userJson.city }}</td>
                </tr>
                <tr>
                    <td>签名：</td>
                    <td colspan="3">{{ userJson.signature }}</td>
                </tr>
                <tr>
                    <td>标签：</td>
                    <td colspan="3">{{ xcommon.tagsToString(userJson.labels) }}</td>
                </tr>
                <tr>
                    <td>认证：</td>
                    <td colspan="3">{{ xcommon.tagsToString(userJson.certification_names) }}</td>
                </tr>
                <tr>
                    <td>角色：</td>
                    <td colspan="3">{{ userJson.role_name }}</td>
                </tr>
                <tr>
                    <td>注册时间：</td>
                    <td colspan="3">{{ userJson.create_at }}</td>
                </tr>
            </table>
            <div class="dc-title mt-15">禁言</div>
            <div class="reason">
                <el-radio-group :disabled="userJson.language_banned === 1" v-model="userJson.language_banned_type">
                    <el-radio :label="-1">永久</el-radio>
                    <el-radio :label="1">3天</el-radio>
                    <el-radio :label="2">1周</el-radio>
                    <el-radio :label="3">1月</el-radio>
                </el-radio-group>
            </div>
            <div class="dc-title mt-15">封禁</div>
            <div class="reason">
                <el-radio-group :disabled="userJson.user_banned === 1" v-model="userJson.user_banned_type">
                    <el-radio :label="1">3天</el-radio>
                    <el-radio :label="2">1周</el-radio>
                    <el-radio :label="3">1月</el-radio>
                    <el-radio :label="-1">永久</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="updateUser('language')" type="primary">{{ userJson.language_banned ? '解禁' : '禁言' }}</el-button>
            <el-button @click="updateUser('user')" type="danger">{{ userJson.user_banned ? '解封' : '封禁' }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
	name: 'UserInfo',
	inject: ['updateList'],
	props: {
		user: Object,
		isVisible: Boolean,
	},
	data () {
		return {
			sexs: ['男','女','保密'],
			duration: 0,
			userJson: {
				language_banned_type: '',
				user_banned_type: ''
			},
			isSave: false
		}
	},
	watch: {
		user: {
			immediate: true,
			handler (val) {
				this.userJson = Object.assign({
					language_banned_type: '',
					user_banned_type: ''
				}, val)
			}
		}
	},
	created () {
		this.$nextTick(() => {
			this.isSave = false
		})
	},
	methods: {
		updateUser (type) {
			const param = {
				type: type === 'language' ? 2 : 1
			}
			let key = 'language_banned'
			if(type !== 'language') key = 'user_banned'
			param.banned = this.userJson[key] ? 2 : 1
			param.banned_type = this.userJson[`${key}_type`]
			if(param.banned === 1 && !param.banned_type) return this.$message.error('请选择时间');
			this.$axios.post(`/users/banned_user/${this.userJson.id}`, param).then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				this.$message.success('操作成功');
				this.$emit('update:isVisible', false)
				if(this.updateList) this.updateList()
				this.isSave = true;
			})
		},
		handleClose () {
			this.$nextTick(() => {
				if(!this.isSave){
					this.userJson.language_banned_type = ''
					this.userJson.user_banned_type = ''
				}
			})
			this.$emit('update:isVisible', false)
		}
	}
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/theme.scss';
.user-info {
	table {
		width: 100%;
		border-top: 1px solid #ebeef5;
		border-left: 1px solid #ebeef5;
		tr {
			td {
				padding: 10px 10px;
				color: #999;
				font-size: 13px;
				border-bottom: 1px solid #ebeef5;
				border-right: 1px solid #ebeef5;
				&:first-child {
					text-align: right;
					color: #666;
				}
			}
		}
	}
	.el-radio-group {
		margin-top: 15px;
	}
}
</style>