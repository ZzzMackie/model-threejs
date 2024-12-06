const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const resolve = p => path.resolve(__dirname, p);
const ENV = process.env.NODE_ENV;

const productionPlugin =
  ENV != 'development'
    ? [
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 30
        }),
        new webpack.optimize.MinChunkSizePlugin({
          minChunkSize: 10000
        })
      ]
    : [];
const optimizationConfig =
  ENV != 'development'
    ? {
        minimize: true
      }
    : {};
const plugins = [new NodePolyfillPlugin(), ...productionPlugin];
const configureWebpack = {
  // 持久化缓存
  cache: {
    type: 'filesystem',
    profile: true,
    name: `${process.env.BUILD_ENV}_cache`
  },
  // 删除注释、打印
  optimization: optimizationConfig,
  plugins,
  resolve: {
    alias: {
      '@': resolve('src/'),
      '@packages': resolve('../packages')
    }
  }
};
const config = {
  publicPath: process.env.PUBLIC_PATH,
  productionSourceMap: false,
  parallel: true,
  devServer: {
    client: {
      overlay: false
    }
  },
  configureWebpack,
  chainWebpack: cfg => {
    if (ENV == 'production') {
      cfg.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.log', 'console.debug', 'console.time', 'console.timeEnd'];
        return args;
      });
    }
  }
};
module.exports = config;
