import path from 'path';
import webpack from 'webpack';

export default {
  cache: true,
  entry: ['./client/main.jsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {stage: 0}
      }
      // // required to write 'require('./style.css')'
      // { test: /\.css$/,    loader: 'style-loader!css-loader' },
      //
      // // required for bootstrap icons
      // { test: /\.woff$/,   loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
      // { test: /\.ttf$/,    loader: 'file-loader?prefix=font/' },
      // { test: /\.eot$/,    loader: 'file-loader?prefix=font/' },
      // { test: /\.svg$/,    loader: 'file-loader?prefix=font/' },
      //
      // // required for react jsx
      // { test: /\.js$/,    loader: 'jsx-loader' },
      // { test: /\.jsx$/,   loader: 'jsx-loader?insertPragma=React.DOM' }
    ]
  },
  resolve: {
    // alias: {
    //   // Bind version of jquery
    //   jquery: 'jquery-2.0.3',
    //
    //   // Bind version of jquery-ui
    //   'jquery-ui': 'jquery-ui-1.10.3',
    //
    //   // jquery-ui doesn't contain a index file
    //   // bind module to the complete module
    //   'jquery-ui-1.10.3$': 'jquery-ui-1.10.3/ui/jquery-ui.js'
    // },
    extensions: ['', '.js', 'jsx']
  },
  plugins: [
  //   new webpack.ProvidePlugin({
  //     // Automtically detect jQuery and $ as free var in modules
  //     // and inject the jquery library
  //     // This is required by many jquery plugins
  //     jQuery: 'jquery',
  //     $: 'jquery'
  //   })
  ]
};
