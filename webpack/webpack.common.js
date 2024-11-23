const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, '..', 'src', 'index.js'),
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, '..', 'dist'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader',
			},
			{
				test: /\.(scss|css)$/,
				oneOf: [
					{
						resourceQuery: /inline/, // Matches imports like 'styles.scss?inline'
						use: ['to-string-loader', 'css-loader', 'sass-loader'], // Inline CSS as string
					},
					{
						use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // Extract CSS for global styles
					},
				],
			},
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '..', 'public', 'index.html'),
			publicPath: '/',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
	],
	infrastructureLogging: { level: 'error' },
	stats: 'errors-only',
};
