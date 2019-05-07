'use strict'

// 通用配置

// 文章搜索条件
export const newsSearch = [
	{ value: 'title', label: '标题' },
	{ value: 'id', label: 'ID' }
]
// 评论搜索条件
export const commentSource = [
	{ value: '0', label: '相册' },
	{ value: '1', label: '文章' },
	{ value: '2', label: '留言板' }
]
// 文件类型
export const fileclassSource = [
	{ value: '0', label: '图片' },
	{ value: '1', label: '多媒体' },
	{ value: '2', label: '文档' }
]

export const fileSource = [
	{ label: 'ID', value: '0' },
	{ label: '地址', value: '1' },
]

// 相册搜索条件
export const photoSearch = [
	{ value: 'title', label: '相册名' },
	{ value: 'id', label: 'ID' }
]
export const commentsReplySearch = [
	{ value: 'id', label: 'ID' }
]
export const roleSearch = [
	{ value: '0', label: '用户' },
	{ value: '1', label: '管理员' },
	{ value: '2', label: '超级管理员' }
]