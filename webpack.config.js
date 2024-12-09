// webpack.config.js
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

function getDirectories(srcpath) {
	return fs
		.readdirSync(srcpath)
		.filter(item => fs.statSync(path.join(srcpath, item)).isDirectory());
}

module.exports = [];

getDirectories('./src').forEach(dir => {
	const bc = {
		mode: 'production',
		entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, './build'),
			filename: `${dir}.js`,
			library: ['CKEditor5', dir],
			libraryTarget: 'umd',
			libraryExport: 'default'
		},
		plugins: [
			new webpack.DllReferencePlugin({
				manifest: require('./node_modules/ckeditor5/build/ckeditor5-dll.manifest.json'),
				scope: 'ckeditor5/src',
				name: 'CKEditor5.dll'
			})
		],
		module: {
			rules: [
				{
					test: /\.svg$/i,
					use: ['raw-loader']
				},
				{
					test: /\.css$/i,
					use: [
						{
							loader: 'style-loader',
							options: {
								injectType: 'singletonStyleTag',
								attributes: {
									'data-cke': true
								}
							}
						},
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: styles.getPostCssConfig({
									themeImporter: {
										themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
									},
									minify: true
								})
							}
						}
					]
				}
			]
		}
		// resolve: {
		// 	extensions: ['', '.js', '.jsx', '.css'],
		// 	modulesDirectories: ['node_modules']
		// }
	}; // configuration
	module.exports.push(bc);
});
