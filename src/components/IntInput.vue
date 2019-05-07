<template>
	<span class="ini-input">
        <el-input
            v-model="val"
            @keyup.native="handleChange"
			@blur="onBlur"
            :placeholder="placeholder">
        </el-input>
    </span>
</template>
<script>
export default {
	name: 'MIntInput',
	props: {
		value: [String, Number],
		placeholder: String
	},
	data () {
		return {
			val: 0
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.val = val
			}
		}
	},
	methods: {
		onBlur () {
			if(!this.val) this.val = this.value
			this.$emit('update:value', this.val)
			this.$emit('change')
		},
		handleChange () {
			if(!this.val && typeof this.val === 'number') return
			this.val = this.val.replace(/[^\.\d]/g,'');
			this.val = this.val.replace('.','');
			if(isNaN(this.val)) return this.val = this.value
		}
	}
}
</script>
<style lang="scss" scoped>
</style>