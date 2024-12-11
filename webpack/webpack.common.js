const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'index.js'),
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(process.env.HOME, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.(svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(scss|css)$/,
        oneOf: [
          {
            resourceQuery: /inline/, // Matches imports like 'styles.scss?inline'
            use: [
              'to-string-loader', 
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: isDev ? '[local]--[hash:base64:4]' : '[hash:base64:6]',
                  },
                },
              },
              'sass-loader'], // Inline CSS as string
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: isDev ? '[local]--[hash:base64:4]' : '[hash:base64:6]',
                    auto: (resourcePath) => {
                      return !resourcePath.includes('src/colors') &&
                             !resourcePath.includes('src/components') &&
                             !resourcePath.includes('src/index');
                    },
                  },
                },
              },
              'sass-loader',
            ], // Extract CSS for global styles
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
      publicPath: '/',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  infrastructureLogging: { level: 'error' },
  stats: 'errors-only',
};
