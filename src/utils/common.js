'use strict'

import E from 'wangeditor'
import '@/plugins/axios'
import { resolve } from 'path'
import ls from 'local-storage'
import Utils from './utils'
import md5 from 'js-md5'
import BMF from 'browser-md5-file'

// 全局处理方法
export default {
	/**
	 * 文件上传限制
	 * @param {*} file 文件流
	 * @return {Boolean} 是否能够上传
	 */
	beforeAvatarUpload (file) {
		const isFORMAT = file.type === 'image/jpeg' || file.type === 'image/png'
		const isLt1M = file.size / 1024 / 1024 < 1
		if (!isFORMAT) {
			this.$message.error('上传图片只能是 JPG/PNG 格式!')
		}
		if (!isLt1M) {
			this.$message.error('上传图片大小不能超过 1MB!')
		}
		return isFORMAT && isLt1M
	},
	/**
	 * 输入框只允许输入数字
	 * @param {Event} event 操作对象
	 */
	inputNumber (event) {},
	/**
	 * 搜索分页重置
	 * @param { Object } arges 搜索条件对象
	 * @param {Function} callBack 调用搜索方法
	 */
	onSearch (arges, callBack) {
		if (arges.page) arges.page = 1
		if (arges.page_num) arges.page_num = 1
		callBack()
	},
	/**
	 * 格式化用户标签
	 * @param {Array} labels 标签数组
	 * @return {String} 格式化后的文字
	 */
	tagsToString (labels) {
		if (!labels) return ''
		let label = ''
		labels.forEach((element, index) => {
			if (index === labels.length - 1) {
				label += element.name
			} else {
				label += `${element.name}、`
			}
		})
		return label
	},
	/**
	 * 获取状态显示文字
	 * @param {Number} status 下标
	 * @param {Array} labels 查询的配置对象
	 * @return {String} 格式化后的文字
	 */
	getStatusLabel (status, labels) {
		for (let index = 0; index < labels.length; index++) {
			const element = labels[index]
			if (element.value === status) return element.label
		}
		return ''
	},
	/**
	 * 创建富文本编辑器
	 * @param {ref} name ref名称
	 * @return {Wangeditor} 富文本编辑器对象
	 */
	createWangeditor (ref, cb) {
		const _this = this
		const editor = new E(ref)
		editor.customConfig.zIndex = 1001
		editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
		editor.customConfig.uploadImgMaxLength = 1
		editor.customConfig.onchange = html => {
			cb(html)
		}
		editor.customConfig.customUploadImg = (files, insert) => {
			_this.fileUpload(files[0]).then(res => {
				if (res.code) return this.$message.error(res.message)
				insert(ls.get('appImagePath') + res.data)
			})
		}
		editor.create()
		return editor
	},
	/**
	 * 关键字搜索话题数据
	 * @param {String} queryString 话题关键字
	 * @return {Array} 话题数据
	 */
	queryTopics (queryString) {
		return new Promise((resolve, reject) => {
			axios
				.get('/search/topics', {
					params: {
						name: queryString
					}
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) {
						return reject()
					}
					resolve(data)
				})
		})
	},
	/**
	 * 关键字搜索负责人数据
	 * @param {String} queryString 负责人关键字
	 * @return {Array} 负责人数据
	 */
	queryManagers (queryString) {
		return new Promise((resolve, reject) => {
			axios
				.get('/search/managers', {
					params: {
						name: queryString
					}
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) {
						return reject()
					}
					resolve(data)
				})
		})
	},
	/**
	 * 关键字搜索行程数据
	 * @param {String} queryString 行程关键字
	 * @return {Array} 行程数据
	 */
	querySchedulings (queryString) {
		return new Promise((resolve, reject) => {
			axios
				.get('/search/schedulings', {
					params: {
						name: queryString
					}
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) {
						return reject()
					}
					resolve(data)
				})
		})
	},
	/**
	 * 关键字搜索相册数据
	 * @param {String} queryString 相册关键字
	 * @return {Array} 相册数据
	 */
	queryMediaGroups (queryString) {
		return new Promise((resolve, reject) => {
			axios
				.get('/search/mediagroups', {
					params: {
						name: queryString
					}
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) {
						return reject()
					}
					resolve(data)
				})
		})
	},
	/**
	 * 获取城市数据
	 * @param {ref} name ref名称
	 * @return {Wangeditor} 富文本编辑器对象
	 */
	getCitys (id = '', page = 0) {
		const type = ['country', 'province', 'city']
		return new Promise((resolve, reject) => {
			axios
				.get('/citys', {
					params: { code: id, type: type[page] }
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) {
						return reject()
					}
					const citys = data.map((element, index) => {
						const item = {
							label: element.name,
							value: element.code
						}
						if (page !== 2) {
							item.children = []
						}
						return item
					})
					resolve(citys)
				})
		})
	},
	/**
	 * 获取角色权限列表
	 * @return {Array} 获取到的角色权限列表
	 */
	getRoles () {
		return new Promise((resolve, reject) => {
			axios.get('/users/roles').then(response => {
				const { code, data, message } = response.data
				if (code !== 0) {
					return reject()
				}
				resolve(data)
			})
		})
	},
	/**
	 * 获取认证列表
	 * @param {String} queryString 认证关键字
	 * @return {Array} 获取到认证列表
	 */
	getIdentitys (queryString) {
		return new Promise((resolve, reject) => {
			axios
				.get('/users/identity_ids', {
					params: {
						name: queryString
					}
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) return reject()
					const identitys = data.map(item => {
						return {
							id: item.id,
							value: item.name
						}
					})
					resolve(identitys)
				})
		})
	},
	/**
	 * 获取帮助菜单分级列表
	 * @param {Number} id 菜单id
	 * @return {Array} 子集菜单列表
	 */
	getHelpMenus (id = 0) {
		return new Promise((resolve, reject) => {
			axios
				.get('/help_menus/plist', {
					params: { pid: id }
				})
				.then(response => {
					const { code, data, message } = response.data
					if (code !== 0) return reject()
					data.forEach(item => {
						item['children'] = []
					})
					resolve(data)
				})
		})
	},
	/**
	 * Banner添加模块提交参数整理
	 * @param {Object} arges 需要整理的参数
	 * @return {Object}	整理后的参数
	 */
	setBannerParam (arges) {
		if (arges.showTimes) {
			arges.startTime = arges.showTimes[0]
			arges.endTime = arges.showTimes[1]
		}
		if (arges.tabId === 0) {
			arges.targetType = 0
		} else {
			if (arges.targetId === '') {
				arges.targetType = -1
			}
		}
		return arges
	},
	/**
	 * 下载文件
	 * @param {Object} 参数对象
	 */
	downloadFile (arges, url) {
		arges.token = ls.get('token')
		arges = Utils.serialize(arges)
		window.open(`${url}?${arges}`, '_blank')
	},
	/**
	 * 获取图片宽高
	 * @param {*} file 图片流
	 * @return {Promise}
	 */
	imageWH (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = e => {
				var data = e.target.result
				var image = new Image()
				image.onload = () => {
					resolve({ w: image.width, h: image.height })
				}
				image.src = data
			}
			reader.readAsDataURL(file)
		})
	},
	/**
	 * 文件上传
	 * @param {File} file 需要上传的文件对象
	 * @param {*} fileMode 上传类型 1:音频 2:视频 3:图片 4:动图 5:其他文档
	 * @return {Promise}
	 */
	fileUpload (file, fileMode) {
		const DOMAINKEY = 'taiheUp@#' //项目标识
		const formData = new FormData()
		const fileUploadUrl = '/upload/upload'
		const FILEMODE = { mp4: 2, mp3: 1, png: 3, jpg: 3, jpeg: 3 }
		let fileWH = ''
		// 上传文件参数配置
		const config = {
			fileMode: fileMode || FILEMODE[file.type.split('/')[1]], // 文件格式 1:音频 2:视频 3:图片 4:动图 5:其他文档
			movImgCount: 1, //
			fileExt: file.type.split('/')[1], // 文件后缀
			safe: 1, // 二次验证 1、开启验证  2、关闭验证
			cache: 1, // 文件重复验证 1、开启  2、关闭
			mode: 'upload', // 上传方式
			secureKey: '' // MD5校验码
		}

		// 获取图片宽高
		if (config.fileMode === 3) {
			this.imageWH(file).then(image => {
				fileWH = `?_width=${image.w}&_height=${image.h}`
			})
		}
		return new Promise((resolve, reject) => {
			const bmf = new BMF()
			bmf.md5(file, (err, fileMd5) => {
				if (!fileMd5) reject('获取文件MD5失败')
				formData.append('fileMode', config.fileMode)
				formData.append('movImgCount', config.movImgCount)
				formData.append('fileExt', config.fileExt)
				formData.append('safe', config.safe)
				formData.append('cache', config.cache)
				formData.append('mode', config.mode)
				formData.append('file', file, file.name)
				formData.append(
					'secureKey',
					Utils.md5Replace(
						md5.hex(
							config.fileMode +
								config.fileExt +
								config.safe +
								fileMd5 +
								DOMAINKEY
						)
					)
				)
				axios({
					url: fileUploadUrl,
					method: 'post',
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					data: formData,
					responseType: 'json'
				}).then(response => {
					if (config.fileMode === 3) {
						response.data.data = response.data.data.path + fileWH
					} else if (
						config.fileMode === 2 &&
						response.data.data.videoInfo
					) {
						const strWH = response.data.data.videoInfo.video_clear.split(
							'x'
						)
						response.data.data =
							response.data.data.path +
							`?_width=${strWH[0]}&_height=${strWH[1]}`
					} else {
						response.data.data = response.data.data.path
					}
					resolve(response.data)
				})
			})
		})
	},
	// 处理分类
	getclassification (array){
		if(array && array.length >0){
			const newarr = []
			array.forEach(ele =>{
				return newarr.push(ele.name)
			})
			return newarr.join('，')
		}
		else{
			return '暂无'
		}
	},

	// 处理标签、分类数组，传入下拉框
	arrayHandle (array) {
		if(array && array.length >=1){
			const newarr = [];
			array.forEach((ele) =>{
				return newarr.push({value:ele.id,label:ele.name})
			})
			return newarr;
		}
	},

	// 处理评论类型

	commentshandle (type){
		const typearray = ['相册','文章','留言板']
		return typearray[type]
	},
	// 回复数处理
	replyhandel (ids){
		if(ids){
			return ids.split('/').length
		}
		else{
			return '暂无回复'
		}
	},
	// 处理评论编辑
	upcommentRule (target,origin,id) {
		target = JSON.parse(JSON.stringify(origin))
		if(!target.reply_ids){
			delete target.reply_ids
		}
		target.id = id
		target.connect_id = target.connect_id.toString()
		return target
	},

	// 处理文件类型

	fileshandle (type){
		const typearray = ['图片','多媒体','文档']
		return typearray[type]
	},

}