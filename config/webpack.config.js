var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var postcssImport = require('postcss-import');
var fontMagician = require('postcss-font-magician');
var colorGuard = require('colorguard');

var sourcePath = path.join(__dirname, '..', 'replay');
var buildPath = path.join(__dirname, '..', 'build/replay');

module.exports = function(grunt, release) {

    var entries = [
        'babel-polyfill',
        'whatwg-fetch',
        './replay/index.js'
    ];

    var ret = {
        entry: entries,
        output: {
            path: buildPath,
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    include: sourcePath,
                    loaders: ["babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0"]
                },
                {
                    test: /\.jade$/,
                    include: sourcePath,
                    loader: "jade"
                },
                {
                    test: /\.css$/,
                    include: sourcePath,
                    loaders: ["style", "css", "postcss"]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'replay/index.jade',
                inject: false
            })
        ],
        stats: {
            modules: false,
            reasons: false,
            chunks: false,
            hash: false,
            timings: false,
            version: false,
            children: false,
            assets: false,
            colors: true
        },
        postcss: function(webpack) { return [
            autoprefixer({ browsers: ['last 2 versions'] }),
            postcssImport({
                addDependencyTo: webpack
            }),
            precss,
            colorGuard,
            fontMagician
        ] }
    };

    if (release) {
        ret.plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: true
        }));
        ret.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }));
        ret.sourcemaps = false;
        ret.debug = false;
    } else {
        ret.plugins.push(new webpack.HotModuleReplacementPlugin());
        ret.sourcemaps = true;
        ret.debug = true;
        ret.devtool = 'source-map';
    }

    return ret;
};
