<template>
	<div class="sidebar">
		<el-menu
			class="el-menu-vertical-demo"
			:default-active="setMenuActive()"
			background-color="#1c2b36"
			text-color="#8dacc4"
			active-text-color="#fff"
			unique-opened
			router>
			<template v-for="item in menus">
				<template v-if="item.children">
                    <el-submenu :index="`${item.id}`" :key="item.id">
                        <template slot="title"><i :class="`fa ${icons[item.id-1]}`"></i>{{ item.name }}</template>
                        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="`${subItem.value}`">{{ subItem.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="`${item.value}`" :key="item.id">
					<i :class="`fa ${icons[item.id-1]}`"></i>{{ item.name }}
				</el-menu-item>
                </template>
			</template>
		</el-menu>
	</div>
</template>
<script>
export default {
	name: 'Maside',
	data () {
		return {
			menus:[
				{
					name:'内容中心',
					id:1,
					children:[
						{
							name:'相册管理',
							value:'/content/photos/'
						},
						{
							name:'文章管理',
							value:'/content/articles/'
						},
						{
							name:'标签管理',
							value:'/content/labels/'
						},
						{
							name:'评论管理',
							value:'/content/comments/'
						},
						{
							name:'回复管理',
							value:'/content/replys/'
						},
						{
							name:'文件管理',
							value:'/content/files/'
						},
						{
							name:'友链管理',
							value:'/content/friendlinks/'
						},
						{
							name:'分类管理',
							value:'/content/classifications/'
						}
					]


				},
				{
					name:'数据统计',
					id:2,
					children:[
						{
							name:'Dashboard',
							value:'/data/dashboard/'
						}
					]


				},
				{
					name:'用户中心',
					id:3,
					children:[
						{
							name:'权限管理',
							value:'/personnel/roles/'
						},
						{
							name:'敏感词',
							value:'/personnel/sensitivewords/'
						},
						{
							name:'院系信息',
							value:'/personnel/collegemsg/'
						}
					]


				}
			],
			icons: ['fa-newspaper-o', 'fa-line-chart', 'fa-user-circle']
		}
	},
	computed: {
		// menus () {
		// 	const permissions = this.$store.state.User.permissions
		// 	const routePermissions = []
		// 	// 筛选路由权限
		// 	permissions.forEach(element => {
		// 		element.children = []
		// 		if(element.type === 0 || element.type === 3){
		// 			routePermissions.push(element)
		// 		}
		// 	})
		// 	// 设置菜单
		// 	return this.xutils.treePermissions(routePermissions)
		// }
	},
	methods: {
		setMenuActive () {
			let path = '/dashboard'
			this.menus.forEach(menu => {
				const {children} = menu
				if(children && children.length > 0){
					children.forEach(item => {
						if(this.$route.path.match(new RegExp(item.value))) {
							path = item.value
						}
					})
				}
			})
			return path
		}
	}
}
</script>
<style lang="scss" scoped>
.sidebar {
	display: block;
	position: absolute;
	width: 240px;
	left: 0;
	top: 55px;
	bottom: 0;
	border-right: 1px solid #17232c;
	transition: left 0.5s ease;
	-webkit-transition: left 0.5s ease;
	-moz-transition: left 0.5s ease;
	-ms-transition: left 0.5s ease;
	-o-transition: left 0.5s ease;
	font-size: 13px;
	overflow-x: hidden;
	.fa {
		margin-right: 10px;
		color: #8dacc4;
		position: relative;
		z-index: 11;
		font-size: 16px;
		width: 21px;
	}
	.el-submenu .el-menu-item {
		padding-left: 50px !important;
	}
	.is-active {
		background-color: #17232c !important;
		.fa {
			color: #fff;
		}
	}
}
.sidebar > ul {
	height: 100%;
	width: 100%;
}
</style>