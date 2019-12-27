const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    open: true,
    hot: true,
    hotOnly: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    usedExports: true,
  },
  output: {
    publicPath: './',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
  },
};
