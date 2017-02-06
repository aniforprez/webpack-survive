const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
};

const common = {
    entry: {
        app: PATHS.app,
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Demo',
        }),
    ],
};

const developmentConfig = {
    devServer: {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        historyApiFallback: true,
        hotOnly: true,
        stats: 'errors-only',
        host: process.env.HOST,
        port: process.env.PORT
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
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
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',

                loader: 'eslint-loader',
                options: {
                    emitWarning: true
                }
            }
        ]
    }
};

module.exports = function(env) {
    if(env == 'production') {
        return common;
    }

    return Object.assign({}, common, developmentConfig, {
        plugins: common.plugins.concat(developmentConfig.plugins),
    });
};