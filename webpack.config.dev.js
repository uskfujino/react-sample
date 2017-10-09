module.exports = {
  entry: './src/Index.tsx',
  output: {
    filename: './public/bundle/min.js'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'ts-loader'}
        ]
      }
    ]
  }
};
