const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
require('dotenv').config({ path: './.env' }); 

module.exports={
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/bundle.js",
    assetModuleFilename: "assets/images/[hash][ext][query]",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /.(jpg|jpeg|png|svg|avif)$/,
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "index.html" }
      ]
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    })
  ],
  devServer: {
    watchFiles: ["src/**/*"],
    port: 8080,
    hot: true,
    open: true
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  resolve:{
    extensions:['.js','.jsx'],
    symlinks: false
  }

}