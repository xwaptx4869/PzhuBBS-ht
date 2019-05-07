<template>
	<div class="footer">
		<span class="footer-brand">
			<strong class="text-danger">pzhuBBS</strong>后台管理系统
		</span>
		<span>© 2019-2020<strong>pzhuBBS</strong>. 保留所有权利.</span>
	</div>
</template>
<script>
export default {
	name: 'Mfooter',
	computed: {},
	methods: {}
}
</script>
<style lang="scss" scoped>
.footer {
	position: absolute;
	padding: 10px 15px;
	bottom: 0;
	right: 0;
	left: 0;
	background: #fff;
	color: #666;
	margin-left: 240px;
	box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05);
	-moz-box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05);
	-webkit-box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05);
	transition: left 0.5s ease;
	-webkit-transition: left 0.5s ease;
	-moz-transition: left 0.5s ease;
	-ms-transition: left 0.5s ease;
	-o-transition: left 0.5s ease;
	font-size: 12px;
	z-index: 1000;
	.footer-brand {
		font-size: 16px;
		margin-right: 20px;
		.text-danger {
			color: #e36159;
		}
	}
}
</style>