const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('prod'),
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  }
}