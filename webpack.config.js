module.exports = [
  {
    entry: './src/index.ts',
    output: {
      path: require('path').resolve(__dirname, 'dist'),
      filename: 'tsrock.js',
      library: 'tsrock'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  }
];
