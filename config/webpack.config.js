const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postcssImport = require('postcss-import');
const fontMagician = require('postcss-font-magician');
const colorGuard = require('colorguard');

const sourcePath = path.join(__dirname, '..', 'replay');
const buildPath = path.join(__dirname, '..', 'build/replay');

module.exports = (grunt, release) => {

    let entries = [
        'whatwg-fetch'
    ];

    entries.push('./replay/index.js');

    let ret = {
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
        postcss: webpack => [
            autoprefixer({ browsers: ['last 2 versions'] }),
            postcssImport({
                addDependencyTo: webpack
            }),
            precss,
            colorGuard,
            fontMagician
        ]
    };

    if (release) {
        ret.plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: true
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
