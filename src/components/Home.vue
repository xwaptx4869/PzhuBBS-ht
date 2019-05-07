<template>
    <div class="wrapper">
        <m-header></m-header>
        <m-aside></m-aside>
        <div class="content">
			<transition name="move" mode="out-in">
				<router-view :key="$route.fullPath"></router-view>
			</transition>
        </div>
        <m-footer></m-footer>
    </div>
</template>
<script>
import Mheader from './Header'
import Maside from './Aside'
import Mfooter from './Footer'
export default {
	name: 'Mhome',
	components: {
		'm-header': Mheader,
		'm-aside': Maside,
		'm-footer': Mfooter
	}
}
</script>
<style lang="scss">
.content {
	background: none repeat scroll 0 0 #f5f5f5;
	position: absolute;
	left: 240px;
	right: 0;
	top: 55px;
	bottom: 0;
	width: auto;
	padding: 30px;
	box-sizing: border-box;
	overflow-y: scroll;
}
.crumbs {
	background-color: #fff;
	font-size: 13px;
	padding: 14px 20px;
	margin-bottom: 20px;
	border-bottom: 1px solid #ddd;
	border-radius: 0;
	-moz-border-radius: 0;
	-webkit-border-radius: 0;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	-moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	color: #666;
}
.smart-widget {
	border: 1px solid #e6e6e6;
	border-radius: 3px;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	margin-bottom: 20px;
	background-color: #fff;
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
	-moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	.smart-widget-header {
		background-color: #fff;
		padding: 15px;
		border-bottom: 1px solid #e6e6e6;
		border-radius: 3px 3px 0 0;
		-moz-border-radius: 3px 3px 0 0;
		-webkit-border-radius: 3px 3px 0 0;
	}
	.smart-widget-inner {
		.smart-widget-section,
		.smart-widget-operate {
			padding: 15px 15px 0 15px;
			.el-row {
				margin-bottom: 10px;
			}
		}
		.smart-widget-body {
			padding: 15px;
		}
	}
	.smart-widget-footer {
		padding: 30px 0;
		text-align: center;
	}
}
</style>