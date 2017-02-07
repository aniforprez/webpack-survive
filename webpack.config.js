const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

const common = merge([
	{
		entry: {
			app: PATHS.app
		},
		output: {
			path: PATHS.build,
			filename: '[name].js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: 'Webpack Demo'
			})
		]
	},
	parts.lintCSS({ include: PATHS.app })
]);

module.exports = function(env) {
	if(env == 'production') {
		return merge([
			common,
			parts.lintJavascript({ include: PATHS.app }),
			parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
			parts.purifyCSS({
				paths: glob.sync(path.join(PATHS.app, '**', '*'))
			})
		]);
	}

	return merge([
		common,
		{
			plugins: [
				new webpack.NamedModulesPlugin(),
				new webpack.WatchIgnorePlugin([
					path.join(__dirname, 'node_modules')
				]),
				new webpack.LoaderOptionsPlugin({
					options: {
						eslint: {
							failOnWarning: false,
							failOnError: true,

							fix: false,

							outputReport: {
								filePath: 'build/checkstyle.xml',
								formatter: require('eslint/lib/formatters/checkstyle')
							}
						}
					}
				})
			]
		},
		parts.devServer({ host: process.env.HOST, port: process.env.PORT }),
		parts.lintJavascript({
			include: PATHS.app,
			options: {
				emitWarning: true
			}
		}),
		parts.loadCSS()
	]);
};
