module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/base'],
	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		'eol-last': ['warn', 'never'],
		quotes: ['warn', 'single'],
		eqeqeq: ['warn', 'always'],
		'no-trailing-spaces': ['warn', { ignoreComments: true }],
		'space-in-parens': ['warn', 'never'],
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'space-before-function-paren': ['error', 'always'],
		'no-tabs': 0,
		indent: 'off',
		'vue/script-indent': ['error', 'tab'],
		'no-new': 0
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
