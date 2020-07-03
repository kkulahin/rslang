/* eslint-disable linebreak-style */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* const { CleanWebpackPlugin } = require('clean-webpack-plugin'); */
const path = require('path');

module.exports = (env = {}) => {
  const isProd = env === 'production';
  const isDev = env === 'development';

  const getLoader = () => (isProd ? MiniCssExtractPlugin.loader : 'style-loader');

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: './index.html',
      }),
    ];
    if (isProd) {
      /* plugins.push(new CleanWebpackPlugin()); */
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name]-[hash:8].css',
      }));
    }
    return plugins;
  };

  return {
    mode: isProd ? 'production' : isDev && 'development',
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: isDev ? '/' : './',
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/env'],
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|jpeg|ico|svg)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name]-[sha1:hash:4].[ext]',
              outputPath: 'img',
              esModule: false,
            },
          }],
        },
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]',
            },
          }],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: getLoader() },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: getLoader() },
            { loader: 'css-loader' },
          ],
        },
        {
          test: /\.mp3$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'audio',
            },
          }],
        },
      ],
    },

    plugins: getPlugins(),

    devServer: {
      open: true,
      historyApiFallback: true,
    },
  };
};
