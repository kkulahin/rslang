/* eslint-disable linebreak-style */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env = {}) => {
  const { mode = 'development' } = env;
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getLoader = () => (isProd ? MiniCssExtractPlugin.loader : 'style-loader');

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: './index.html',
      }),
    ];
    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name]-[hash:8].css',
      }));
    }
    return plugins;
  };

  return {
    mode: isProd ? 'production' : isDev && 'development',
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
          test: /\.css$/,
          use: [
            { loader: getLoader() },
            { loader: 'css-loader' },
          ],
        },
      ],
    },

    plugins: getPlugins(),

    devServer: {
      open: true,
    },
  };
};