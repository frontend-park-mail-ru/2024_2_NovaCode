const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname,  '..', 'src', 'index.js'),
    module: {
        rules: [
            { 
                test: /\.hbs$/, 
                loader: 'handlebars-loader' 
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(js)$/, 
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,  '..', 'dist'),
        clean: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,  '..', 'public', 'index.html'),
            publicPath: '/'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ]
};
