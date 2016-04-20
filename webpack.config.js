var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,
  entry: './assets/js/index',
  devtool: '#source-map',
  output: {
    path: path.resolve('./assets/bundles/'),
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].map.js"
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }, {
      test: /\.(woff|woff2)$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf$/,
      loader: "file-loader"
    }, {
      test: /\.eot$/,
      loader: "file-loader"
    }, {
      test: /\.svg$/,
      loader: "file-loader"
    }]
  },
  plugins: [
    new BundleTracker({path: __dirname, filename: './webpack-stats.json'}),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
  ]
}
