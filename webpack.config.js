// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const gameRoot = process.cwd()

// the path(s) that should be cleaned
let pathsToClean = [
  'build'
]

// the clean options to use
let cleanOptions = {
  verbose: true,
  dry: false
}

var config = {
  // bundle javascript
  entry: `${gameRoot}/src/index.js`,
  output: {
    path: `${gameRoot}/build`,
    filename: 'struktogramm.js'
    // path: path.resolve(__dirname, "build"),
    // publicPath: "${game_root}/build"
  },
  resolve: { symlinks: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              // sourceMap: true,
              // importLoaders: 1
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ pathsToClean, cleanOptions }),
    new MiniCssExtractPlugin({
      filename: 'struktogramm.css',
      chunkFilename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Struktog.',
      meta: { viewport: 'width=device-width, initial-scale=1, user-scalable=no' }
    })
  ],
  devServer: {
    port: 8080,
    contentBase: './src',
    watchOptions: {
      poll: true
    },
    open: true
  }
}

module.exports = (env, argv) => {
  if (!argv || !argv.mode) { config.mode = 'development' }
  if (!argv || !argv.mode || argv.mode === 'development') { config.devtool = 'source-map' }
  return config
}
