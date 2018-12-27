const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin} = webpack;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const npm = require('./package.json');
const plugins = [];

if (mode === 'production') {
  plugins.push(new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      discardComments: true,
      map: {
        inline: false
      }
    },
  }));
}

const client = {
  mode,
  devtool: 'source-map',
  entry: {
    osjs: [
      '@babel/polyfill',
      'whatwg-fetch',
      'element-remove',
      path.resolve(__dirname, 'src/client/index.js'),
      path.resolve(__dirname, 'src/client/index.scss')
    ]
  },
  performance: {
    maxEntrypointSize: 500 * 1024,
    maxAssetSize: 500 * 1024
  },
  optimization: {
    minimize,
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new DefinePlugin({
      OSJS_VERSION: JSON.stringify(npm.version)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/client/index.ejs'),
      favicon: path.resolve(__dirname, 'src/client/favicon.png'),
      title: `Skylark ${npm.version}`
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'SKYLARK_DEVELOPMENT'
    ]),
    ...plugins
  ],
  module: {
    rules: [
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /typeface/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              minimize,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!simplejsonconf)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: {
          loader: 'source-map-loader'
        }
      }
    ]
  }
};

module.exports = [
  client,
  require('./src/packages/News/webpack.config.js'),
  require('./src/packages/Tuner/webpack.config.js'),
  require('./src/packages/Radio/webpack.config.js'),
  require('./src/packages/Reader/webpack.config.js'),
  require('./src/packages/Network/webpack.config.js'),
  require('./src/packages/Weather/webpack.config.js'),
  require('./src/packages/WhatsNew/webpack.config.js'),
  require('./src/packages/Messaging/webpack.config.js'),
  require('./src/packages/Wikipedia/webpack.config.js')
]
