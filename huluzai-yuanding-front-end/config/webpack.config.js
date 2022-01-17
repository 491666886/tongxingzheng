const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  
  entry: {
    // main: './src/main.js'
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../distyd')
  },
  resolve: {
    extensions: ['.js', '.vue'],
    
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                "@babel/plugin-syntax-dynamic-import"
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModule: false
        }
      }
    ]
  },
  devServer: {
     port:8080,
    proxy: {
      "/": {
          // target: "http://172.38.50.90:8001",
         target: "http://121.36.97.239:8080",
        // target: "http://192.168.88.217:8001",
        // target: 'http://10.19.220.154:8187',
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: ' 抗疫应急通行系统',
      template: './index.html'
    }),
    new VueLoaderPlugin(), // 这个不能删
  ],
  // devtool: 'source-map'//打包显示webpeak源码
}
