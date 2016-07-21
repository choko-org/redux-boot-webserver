var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {

  debug: false,

  entry: {
    index: './src/index.js',
  },

  node: {
    __dirname: true,
    __filename: true,
  },

  target: 'node',

  devtool: 'source-map',

  output: {
    path: './dist',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'src'
    ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, './src')
      ],
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },

  externals: nodeModules,
}
