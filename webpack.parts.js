const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.devServer = function({ host, port }) {
	return {
		devServer: {
			historyApiFallback: true,
			hotOnly: true,
			stats: 'errors-only',
			host,
			port
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]
	};
};

exports.lintJavascript = function({ include, exclude, options }) {
	return {
		module: {
			rules: [
				{
					test: /\.js$/,
					include,
					exclude,
					enforce: 'pre',

					loader: 'eslint-loader',
					options
				}
			]
		}
	};
};

exports.loadCSS = function({ include, exclude } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,

					// use: ['style-loader', 'css-loader?modules']
					use: ['style-loader', 'css-loader']
				}
			]
		}
	};
};

exports.extractCSS = function({ include, exclude, use }) {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,

					use: ExtractTextPlugin.extract({
						use,
						fallback: 'style-loader'
					})
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].css')
		]
	};
};

exports.autoprefix = function() {
	return {
		loader: 'postcss-loader',
		options: {
			plugins: function() {
				return [
					require('autoprefixer')
				];
			}
		}
	};
};

exports.purifyCSS = function({ paths }) {
	return {
		plugins: [
			new PurifyCSSPlugin({ paths })
		]
	};
};

exports.lintCSS = function({ include, exclude }) {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,
					enforce: 'pre',

					loader: 'postcss-loader',
					options: {
						plugins: function() {
							return [
								require('stylelint')({
									ignoreFiles: 'node_modules/**/*.css'
								})
							];
						}
					}
				}
			]
		}
	};
};
