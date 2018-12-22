const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => ({
  mode,
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'index.js'),
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    osjs: 'OSjs'
  },
  optimization: {
    minimize,
  },
  plugins: [
    new CopyWebpackPlugin([
      path.resolve(__dirname, 'icon.png'),
      {from: path.resolve(__dirname, 'epub.js'), to: 'epub.js'},
      {from: path.resolve(__dirname, 'MediaElement'), to: 'MediaElement'},
      {from: path.resolve(__dirname, 'showdown'), to: 'showdown'},
      {from: path.resolve(__dirname, 'ViewerJS'), to: 'ViewerJS'},
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
});
