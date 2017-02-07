const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanwebpackPlugin = require('clean-webpack-plugin');

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

exports.loadJavascript = function({ include, exclude }) {
	return {
		module: {
			rules: [
				{
					test: /\.js$/,
					include,
					exclude,

					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
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

exports.loadImages = function({ include, exclude, options } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.(png|jpe?g)$/,
					include,
					exclude,

					use: {
						loader: 'url-loader',
						options
					}
				}
			]
		}
	};
};

exports.loadSVG = function({ include, exclude, options } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.svg$/,
					include,
					exclude,

					use: {
						loader: 'file-loader',
						options
					}
				}
			]
		}
	};
};

exports.loadFonts = function({ include, exclude, options } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
					include,
					exclude,

					use: {
						loader: 'file-loader',
						options
					}
				}
			]
		}
	};
};

exports.generateSourceMaps = function(type) {
	return {
		devtool: type
	};
};

exports.extractBundles = function({ bundles, options }) {
	const entry = {};
	const names = [];

	bundles.forEach(({ name, entries }) => {
		if(entries) {
			entry[name] = entries;
		}

		names.push(name);
	});

	return {
		entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin(
				Object.assign({}, options, { names })
			)
		]
	};
};

exports.clean = function(path) {
	return {
		plugins: [
			new CleanwebpackPlugin([path])
		]
	};
};
