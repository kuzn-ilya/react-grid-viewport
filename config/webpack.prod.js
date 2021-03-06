var webpack = require('webpack');
var common = require('./webpack.common.js');
var merge = require('webpack-merge');
var glob = require('glob');
var path = require('path');
var cssVars = require('../sources/stubs/cssVars.js');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = merge.smart(common, {
    output: {
        library: 'ReactScrollable',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../build'),
        filename: '[name].js',
    },

    entry: {
        components: './sources/components/index.ts'
    },

    externals: {
        react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom'
        },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        sourceMap: false,
                        inlineSourceMap: true
                    }
                },
                exclude: ["node_modules"]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                camelCase: true,
                                localIdentName: '[local]'
                            }
                        }, {
                            loader: path.join(__dirname, 'cssLoader.js'),
                            options: cssVars.CSS_ALL_VARS
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            "process.env": { 
                NODE_ENV: JSON.stringify("production") 
            }
        })        
    ]    
});

module.exports = config;