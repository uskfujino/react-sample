const webpack = require('webpack');

module.exports = {
  entry: "./src/Index.tsx",
  output: {
    filename: './public/bundle/min.js'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM',
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: "ts-loader"}
        ]
      }
    ]
  }
};
