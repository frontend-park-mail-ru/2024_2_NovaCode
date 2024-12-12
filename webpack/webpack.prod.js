const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    // new CompressionPlugin(),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            [
              'svgo',
              {
                plugins: [
                  {
                    name: 'preset-default',
                    'addAttributesToSVGElement': {
                      params: {
                        attributes: [
                          { xmlns: 'http://www.w3.org/2000/svg' },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          ],
        },
      },
    }),
  ],
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
});
