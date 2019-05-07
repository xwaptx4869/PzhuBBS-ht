<template>
	<div class="dashboard">
		<el-row>
			<el-col :span="24">
				<div class="page-title">实时监控</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<div class="statistic" style="background-color:#2baab1;">
					<div class="statistic-title">用户总数</div>
					<div class="statistic-value">{{ userTotal }}</div>
					<div class="m-top-md right">自{{ userTotalDay }}起统计到此时</div>
					<div class="statistic-icon-background">
						<i class="fa fa-users"></i>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row class="chart-item">
			<el-col :span="6">
				<div class="statistic" style="background-color:#23b7e5;">
					<div class="statistic-title">今日新增用户</div>
					<div class="statistic-value">{{ userAdd.total }}</div>
					<div class="contrast add">{{ userAdd.rate }}%</div>
					<div class="statistic-icon-background">
						<i class="fa fa-user-plus"></i>
					</div>
				</div>
			</el-col>
			<el-col :span="18">
				<div class="chart">
					<ve-line height="260px" :data="userAdd.chartData"></ve-line>
				</div>
			</el-col>
		</el-row>
		<el-row class="statistic-list">
			<el-col :span="6" v-for="(item, index) in numerical" :key="index">
				<div class="statistic" :style="'background-color:' + item.color">
					<div class="statistic-title">{{ item.title }}</div>
					<div class="statistic-value">{{ item.value }}</div>
					<div class="m-top-md">{{ item.rate }}%</div>
					<div class="statistic-mood">
						<span v-for="(item, index) in item.moods" :key="index">{{ `${item.name}：${item.rate}%` }}</span>
					</div>
					<div class="statistic-icon-background">
						<i :class="'fa ' + item.icon"></i>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row class="ranking-list">
			<el-col :span="6" v-for="(item, index) in tables" :key="index">
				<div class="ranking-item">
					<div class="ranking-hd">{{ item.name }}</div>
					<div class="ranking-bd">
						<el-table :data="item.data" border style="width: 100%">
							<el-table-column align="center" v-if="item.key !== 'keywordTopTen'" prop="id" width="80" label="id">
							</el-table-column>
							<el-table-column align="center" :show-overflow-tooltip="true" prop="name" :label="item.tdName">
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-col>
		</el-row>
		<!-- 用户信息 -->
		<user-info
			:user="selectUser"
			:is-visible.sync="userDialogVisible">
		</user-info>
	</div>
</template>
<script>
import UserInfo from '@/components/UserInfo'
export default {
	name: 'Dashboard',
	components: {
		UserInfo
	},
	data () {
		return {
			selectUser: {},
			userDialogVisible: false,
			userTotal: 0,
			userTotalDay: '',
			topTen: {
				keywordTopTen: [],
				reviewTopTen: [],
				topicTopTen: [],
				userTopTen: []
			},
			userAdd: {
				rate: 0,
				total: 0,
				chartData: {
					columns: ['时间', '今日用户', '昨日用户'],
					rows: []
				}
			},
			userOnline: {
				rate: 0,
				total: 0,
				chartData: {
					columns: ['时间', '今日用户', '昨日用户'],
					rows: []
				}
			},
			tables: [{
				name: '今日热贴TOP10',
				key: 'reviewTopTen',
				data: [],
				tdName: '文章名'
			},{
				name: '今日用户TOP10',
				key: 'userTopTen',
				data: [],
				tdName: '用户名'
			},{
				name: '今日点赞TOP10',
				key: 'topicTopTen',
				data: [],
				tdName: '文章名'
			},{
				name: '今日收藏TOP10',
				key: 'keywordTopTen',
				data: [],
				tdName: '文章名'
			}],
			numerical: [
				{
					title: '今日点赞数',
					value: 0,
					rate: 0,
					icon: 'fa-calendar-check-o',
					color: '#2baab1',
					moods: []
				},
				{
					title: '今日发帖数',
					value: 0,
					rate: 0,
					icon: 'fa-file-text-o',
					color: '#23b7e5'
				},
				{
					title: '今日评论数',
					value: 0,
					rate: 0,
					icon: 'fa-commenting-o',
					color: '#7266ba'
				},
				{
					title: '今日收藏数',
					value: 0,
					rate: 0,
					icon: 'fa-feed',
					color: '#e36159',
					moods: []
				}
			],
		}
	},
	provide: function () {
		return {
			updateList: this.getDashboard
		}
	},
	created () {
		// this.getDashboard()
	},
	methods: {
		rateToString (rate, type = 0) {
			if(!rate) return 0
			rate = rate.toString().split('-')
			if(rate.length > 1) {
				rate = (rate[1] * 100).toFixed(2)
				return type ? `-${rate}` : rate
			}else {
				rate = (rate[0] * 100).toFixed(2)
				return type ? `+${rate}` : rate
			}
		},
		getEmoji (data) {
			const emojiString = ['大爱','感动','呲笑','安慰','惊讶','尴尬']
			const emojis = data.map(element => {
				return {
					name: emojiString[element.emoji],
					count: element.emojiCount,
					rate: this.rateToString(element.rate)
				}
			})
			return emojis
		},
		getDashboard () {
			this.$axios.get('/dashboard').then(response => {
				const {code, data, message} = response.data
				if(code !== 0) return this.$message.error(message);
				if(data.topTen){
					this.tables.forEach(element => {
						element.data = data.topTen[element.key]
					});
				}
				if(data.onLine){
					this.userOnline.rate = this.rateToString(data.onLine.userOnlineRate, 1)
					this.userOnline.total = data.onLine.userOnlineTotal
					const onLineChartData = data.onLine.userOnlineToday.map((element, index) => {
						return {
							'时间': `${element.hour}点`,
							'今日用户': element.count,
							'昨日用户': data.onLine.userOnlineYesterday[index].count
						}
					})
					this.userOnline.chartData.rows = onLineChartData
				}
				if(data.user){
					this.userTotal = data.user.totalUser
					this.userTotalDay = data.user.firstDay
					this.userAdd.rate = this.rateToString(data.user.userAddRate, 1)
					this.userAdd.total = data.user.userAddTotal
					const addChartData = data.user.userAddToday.map((element, index) => {
						return {
							'时间': `${element.hour}点`,
							'今日用户': element.count,
							'昨日用户': data.user.userAddYesterday[index].count
						}
					})
					this.userAdd.chartData.rows = addChartData
				}
				if(data.content){
					const numericalData = this.numerical.map((element, index) => {
						if(element.title === '今日点赞数'){
							element.value = data.content.userSignTotal
							element.rate = this.rateToString(data.content.userSignRate, 1)
							element.moods = this.getEmoji(data.content.emojiSignRate)
						}else if(element.title === '今日发帖数'){
							element.value = data.content.postTotal
							element.rate = this.rateToString(data.content.postRate, 1)
						}else if(element.title === '今日评论数'){
							element.value = data.content.reviewTotal
							element.rate = this.rateToString(data.content.reviewRate, 1)
						}else {
							element.value = data.content.biuTotal
							element.rate = this.rateToString(data.content.biuRate, 1)
							element.moods = this.getEmoji(data.content.emojiBiuRate)
						}
						return element
					})
					this.numerical = numericalData
				}
			})
		}
	}
}
</script>
<style lang="scss">
.page-title {
	font-size: 24px;
	color: #666;
}
.page-sub-header {
	color: #888;
	font-size: 12px;
	margin-top: 10px;
	.fa-map {
		margin: 0 5px;
		color: #e36159;
	}
}
.statistic {
	margin: 20px 0;
	text-align: center;
	padding: 30px 15px;
	color: #fff;
	border-radius: 6px;
	position: relative;
	height: 130px;
	.statistic-title {
		text-transform: uppercase;
		font-size: 16px;
		z-index: 2;
	}
	.statistic-value {
		font-size: 36px;
		z-index: 2;
		margin-top: 15px;
	}
	.m-top-md {
		margin-top: 15px;
		font-size: 16px;
		&.right {
			text-align: right;
			font-size: 14px;
		}
	}
	.statistic-icon-background {
		position: absolute;
		font-size: 120px;
		right: 0;
		bottom: 0;
		opacity: 0.2;
	}
	.statistic-mood {
		font-size: 13px;
		margin-top: 10px;
		text-align: left;
		line-height: 20px;
		span {
			width: 33.33%;
			float: left;
			font-size: 12px;
		}
	}
}
.chart-item {
	margin-bottom: 20px;
	.statistic {
		margin: 0px;
		height: 200px;
		.statistic-value {
			margin-top: 80px;
		}
		.contrast {
			margin-top: 50px;
		}
	}
	.chart {
		background-color: #fff;
		margin-left: 20px;
		height: 240px;
		border-radius: 6px;
		padding-top: 20px;
	}
}
.statistic-list {
	.el-col {
		.statistic {
			margin-right: 20px;
		}
		&:nth-last-child(1) .statistic {
			margin-right: 0px;
		}
	}
}
.ranking-list {
	.el-col {
		.ranking-item {
			margin-right: 20px;
		}
		&:nth-last-child(1) .ranking-item {
			margin-right: 0px;
		}
	}
	.ranking-item {
		border-radius: 6px;
		overflow: hidden;
		margin-right: 20px;
		.ranking-hd {
			padding: 15px;
			background-color: #4c5f70;
			color: #fff;
		}
		.ranking-bd {
			padding: 15px;
			background-color: #fff;
		}
	}
}
.dashboard {
	padding-bottom: 40px;
}
</style>