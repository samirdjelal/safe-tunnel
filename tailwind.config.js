module.exports = {
	purge: {
		enabled: true,
		content: [
			'./public/**/*.html',
			'./src/**/*.html',
			'./src/**/*.jsx',
			'./src/**/*.js',
		],
	},
	theme: {
		extend: {
			boxShadow: {
				// outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
				outline: '0 0 0 3px #edf2f7',
			}
		}
	},
	variants: {},
	plugins: [],
}
