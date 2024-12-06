const path = require('path');
const { merge } = require('webpack-merge');
const { defineConfig } = require('@vue/cli-service');

const webpackBaseConfig = require(path.resolve('../../build/webpack.base.config'));
const config = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src/'),
        '@packages': path.resolve(__dirname, '../')
      }
    }
  }
};
const mergeConfig = merge(webpackBaseConfig, config);
module.exports = defineConfig(mergeConfig);
