'use strict'
import _ from 'lodash'

// 工具类
export default {
	/**
	 * 格式化用户标签
	 * @param {Array} labels 标签数组
	 * @return {String} 转化后的字符
	 */
	formatLabel (labels) {
		if (!labels) return ''
		labels = labels.toString()
		labels = labels.replace(/,/g, '/')
		return labels
	},
	/**
	 * tags数组转ids
	 * @param {Array} data tags数组
	 * @return {String} 转化后的字符
	 */
	toStringTag (data, key = 'id') {
		const _array = []
		data.forEach(item => {
			_array.push(item[key])
		})
		return _array.toString()
	},
	/**
	 * 验证tag是否重复
	 * @param {Array} data 需要验证数组
	 * @param {Object} item 需要验证新增对象
	 * @return {Boolean} 验证结果
	 */
	isTagRepeat (data, item) {
		// 验证tag添加是否重复
		for (let index = 0; index < data.length; index++) {
			if (data[index].id === item.id) {
				return false
			}
		}
		return true
	},
	/**
	 * 数组转树形
	 * @param {Array} data 需要整理的数组
	 * @return {Array} 整理后的树形数据
	 */
	treePermissions (data, format = {}) {
		const _rootId = format.rootId || 0
		const _id = format.id || 'id'
		const _pid = format.parentId || 'parent_id'
		const _children = format.children || 'children'
		// 递归方法
		function getNode (id) {
			const node = []
			for (let i = 0; i < data.length; i++) {
				if (data[i][_pid] === id) {
					if (data[i][_children])
						data[i][_children] = getNode(data[i][_id])
					node.push(data[i])
				}
			}
			if (node.length === 0) return []
			return node
		}
		// 使用根节点
		return getNode(_rootId)
	},
	/**
	 * 参数序列化
	 * @param {Object} data 需要序列化的参数对象
	 * @returns {String} 序列化后的字符
	 */
	serialize (data) {
		return Object.keys(data)
			.map(key => `${key}=${encodeURIComponent(data[key])}`)
			.join('&')
	},
	/**
	 * 树形转数组
	 * @param {Array} data 需要整理的树形数组
	 * @return {Array} 整理后的数据
	 */
	treeToArray (tree, key = 'child_permissions') {
		function getNode (con, item) {
			con.push(item)
			const childrens = item[key]
			if (childrens && childrens.length > 0)
				childrens.reduce(getNode, con)
			return con
		}
		return tree.reduce(getNode, []).map(item => {
			item[key] = []
			return item
		})
	},
	/**
	 * 过滤请求参数
	 * @param {Object} arges 参数对象
	 * @returns 整理后参数
	 */
	filterParam (arges) {
		let argesone = JSON.parse(JSON.stringify(arges))
		// 整理搜索条件
		if (argesone.searchValue) {
			argesone[argesone.searchName] = argesone.searchValue
		}
		argesone.searchValue = ''
		argesone.searchName = ''
		// 检查id类型
		if (argesone.id) {
			argesone.id = parseInt(argesone.id)
			if (isNaN(argesone.id)) {
				argesone.id = 'error'
			}
		}
		// 检查用户id类型
		if (argesone.addUser) {
			argesone.addUser = parseInt(argesone.addUser)
			if (isNaN(argesone.addUser)) {
				argesone.addUser = 'error'
			}
		}
		// 检查用户id类型
		if (argesone.user_id) {
			argesone.user_id = parseInt(argesone.user_id)
			if (isNaN(argesone.user_id)) {
				argesone.user_id = 'error'
			}
		}
		for (const key in argesone) {
			if (argesone[key] === '') {
				_.unset(argesone, key)
			}
		}
		return argesone
	},
	/**
	 * 整理Sort数据
	 * @param {Array} sorts 需要操作的对象
	 * @param {Boolean} 操作成功或者失败
	 */
	setSort (sorts, item) {
		const sort = parseInt(item.sort)
		for (let index = 0; index < sorts.length; index++) {
			const element = sorts[index]
			if (element.id === item.id) {
				return (element.sort = sort)
			}
		}
		sorts.push({
			id: item.id,
			sort: item.sort
		})
	},
	/**
	 * 时间格式转换
	 * @param {Number}
	 */
	formatTime (timestamp) {
		let time = new Date(timestamp)
		let [y, m, d, h, mm, s] = [
			time.getFullYear(),
			time.getMonth() + 1,
			time.getDate(),
			time.getHours(),
			time.getMinutes(),
			time.getSeconds()
		]
		return (
			y +
			'-' +
			(m < 10 ? '0' + m : m) +
			'-' +
			(d < 10 ? '0' + d : d) +
			' ' +
			(h < 10 ? '0' + h : h) +
			':' +
			(mm < 10 ? '0' + mm : mm) +
			':' +
			(s < 10 ? '0' + s : s)
		)
	},
	/**
	 * 文件上传MD5映射
	 * @param {String} 需要映射的字符
	 * @return 映射后的字符
	 */
	md5Replace (str) {
		const md5Map = {
			'0': 'f',
			'1': '7',
			'2': 'c',
			'3': '8',
			'4': 'd',
			'5': '0',
			'6': 'e',
			'7': '1',
			'8': 'a',
			'9': '9',
			a: 'b',
			b: '5',
			c: '3',
			d: '4',
			e: '2',
			f: '6'
		}
		let newStr = ''
		for (let index = 0; index < str.length; index++) {
			let replaceStr = str[index]
			for (const key in md5Map) {
				if (replaceStr === key) {
					replaceStr = md5Map[key]
					break
				}
			}
			newStr += replaceStr
		}
		return newStr
	},

	// 处理id数组
	idsArray (ids){
		if(ids == null){
			return '暂无'
		}
		return ids.split('/').join('，');
	}
}