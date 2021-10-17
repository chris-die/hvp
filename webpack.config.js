const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        loader: 'url-loader',
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        options: {
          limit: 100000,
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Video Player',
      template: 'src/index.html'
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  stats: {
    children: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
      })
    ],
  },
  performance: {
    // Aiming for 700kB total. May have to tweak this :-)
    maxEntrypointSize: 700000,
    maxAssetSize: 700000,
  },

  // devServer: {
  //   headers: {},
  //   static: [
  //     {
  //       directory: path.join(__dirname, 'public'),
  //     },
  //   ],
  // }
};
