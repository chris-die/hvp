const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) =>{
  return {
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
          use: [
            argv.mode === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
            'css-loader'
          ],
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
    ].concat(argv.mode === 'production' ? [new MiniCssExtractPlugin(), new CssMinimizerPlugin()] : []),
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    stats: {
      children: true,
      // modules: false,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
        })
      ].concat(argv.mode === 'production' ? [new CssMinimizerPlugin()] : []),
    },
    performance: {
      maxEntrypointSize: 700000,
      maxAssetSize: 700000,
    },

    devServer: {
      // headers: {},
      static: [
        {
          directory: path.join(__dirname, 'public/embed'),
          publicPath: '/embed'
        },
        {
          directory: path.join(__dirname, 'dist'),
          publicPath: '/dist'
        },
      ],
    }
  }
};
