const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (env, option) => {
  return {
    devtool: option.mode === 'development' ? 'source-map' : '',
    entry: {
      app: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.html$/, use: [{ loader: 'html-loader' }] },
        { test: /\.css$/, loaders: ['style-loader', 'css-loader'], },
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        path: path.resolve(__dirname, 'docs', 'index.html'),
        template: 'index.html',
      })
    ]
  }
};