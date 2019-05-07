import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/login/',
			name: 'login',
			component: resolve => require(['@/views/Login.vue'], resolve)
		},
		{
			path: '/',
			component: resolve => require(['@/components/Home.vue'], resolve),
			children: [
				{
					path: '/',
					component: resolve =>
						require(['@/views/Dashboard.vue'], resolve)
				},
				{
					path: '/data/dashboard/',
					component: resolve =>
						require(['@/views/Dashboard.vue'], resolve)
				},
				{
					path: '/content/articles/',
					component: resolve =>
						require(['@/views/ArticlesManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/articles/add/',
					component: resolve =>
						require(['@/views/ArticleAdd.vue'], resolve)
				},
				{
					path: '/content/articles/edit/:id',
					component: resolve =>
						require(['@/views/ArticleAdd.vue'], resolve)
				},
				{
					path: '/content/classifications/',
					component: resolve =>
						require(['@/views/ClassificationsManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/comments/add/',
					component: resolve =>
						require(['@/views/CommentAdd.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/comments/edit/:id',
					component: resolve =>
						require(['@/views/CommentAdd.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/replys/',
					component: resolve =>
						require(['@/views/ReplyManage.vue'], resolve)
				},
				{
					path: '/content/replys/add',
					component: resolve =>
						require(['@/views/ReplyAdd.vue'], resolve)
				},
				{
					path: '/content/replys/edit/:id',
					component: resolve =>
						require(['@/views/ReplyAdd.vue'], resolve)
				},
				{
					path: '/content/comments/',
					component: resolve =>
						require(['@/views/CommentManage.vue'], resolve)
				},
				{
					path: '/content/photos/',
					component: resolve =>
						require(['@/views/PhotoManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/photos/add/',
					component: resolve =>
						require(['@/views/PhotoAdd.vue'], resolve)
				},
				{
					path: '/content/photos/edit/:id',
					component: resolve =>
						require(['@/views/PhotoEdit.vue'], resolve)
				},
				{
					path: '/content/labels/',
					component: resolve =>
						require(['@/views/LabelManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/friendlinks/',
					component: resolve =>
						require(['@/views/FriendLinkManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/files/',
					component: resolve =>
						require(['@/views/FileManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/files/add',
					component: resolve =>
						require(['@/views/FileAdd.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/content/files/edit/:id',
					component: resolve =>
						require(['@/views/FileAdd.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/personnel/roles/',
					component: resolve =>
						require(['@/views/RoleManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/personnel/collegemsg/',
					component: resolve =>
						require(['@/views/CollegeManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/personnel/sensitivewords/',
					component: resolve =>
						require(['@/views/SensitiveWordsManage.vue'], resolve),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/personnel/roles/add/',
					component: resolve =>
						require(['@/views/RoleAdd.vue'], resolve)
				},
				{
					path: '/personnel/roles/edit/:id',
					component: resolve =>
						require(['@/views/RoleAdd.vue'], resolve)
				}
			]
		}
	]
})