<template>
	<div id="app">
		<router-view :to="'/login/'" />
	</div>
</template>

<script>

export default {
	name: 'app'
}
</script>

<style lang="scss">
@import './assets/style/reset.scss';
@import './assets/style/common.scss';
</style>