const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    // Add support HTML
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: 'index.html'
    })
  ]
}