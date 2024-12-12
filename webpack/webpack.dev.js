const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    mode: 'development',
    // devServer: {
    //     compress: true,
    //     port: 3000,
    //     compress: true,
    //     open: false,
    //     hot: true,
    //     historyApiFallback: true,
    // },
});
