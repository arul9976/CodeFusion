module.exports = {
  // other webpack settings

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3001,
    headers: {
      'Content-Type': 'application/javascript',  // Ensures the right MIME type
    },
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }

    ],
  },
  resolve: {
    alias: {
      ace: 'ace-builds/src-noconflict', // Use ace-builds directly
    },
  },
};


