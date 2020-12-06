const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = {
    entry: {
        index: ['./src/index.js'],
        login: ['./src/login.js'],
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle_[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.css/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015','react', 'stage-0']
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin("bundle_style.css"),
        // new webpack.DefinePlugin({
        //     'process.env':{
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress:{
        //         warnings: true
        //     }
        // })
    ]
};

module.exports = config;