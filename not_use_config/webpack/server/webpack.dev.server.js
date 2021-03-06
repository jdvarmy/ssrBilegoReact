const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const alias = require('../alias');
const rules = require('./rules');

const nodeConf = {
  target: 'node',
  entry: './config/server.js',
  externals: [nodeExternals(), 'react-helmet'],
  output: {
    path: path.resolve('build'),
    filename: 'server.js',
    library: 'app',
    libraryTarget: 'commonjs2',
    publicPath: '/',
  },
  module: {
    rules,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public/css', to: 'css' },
      { from: 'public/scripts', to: 'scripts' },
      { from: 'public/images', to: 'images' },
      { from: 'public/static/**', to: '.' },
    ]),
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
      window: path.resolve(path.join(__dirname, './../window.mock')),
      document: 'global/document',
    }),
  ],
  resolve: {
    alias,
    modules: [
      path.resolve('./app'),
      path.resolve(process.cwd(), 'node_modules'),
    ],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
};

const browserConf = require('../client/webpack.dev.babel');

module.exports = [browserConf, nodeConf];
