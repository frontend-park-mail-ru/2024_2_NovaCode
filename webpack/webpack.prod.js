const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(commonConfig, {
    mode: 'production',
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
});
