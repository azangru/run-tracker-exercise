import path from 'path';
import babel from 'gulp-babel';
import gulp from 'gulp';
import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import normalizeCSS from 'postcss-normalize';
import nested from 'postcss-nested';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import csswring from 'csswring';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config.js';

let paths = {
  jsEntry: path.join(__dirname, 'client/main.jsx'),
  cssEntry: path.join(__dirname, 'client/styles.css'),
  js: [path.join(__dirname, 'client/**/*.js'), path.join(__dirname, 'client/**/*.jsx')],
  styles: path.join(__dirname, 'client/**/*.css'),
  images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].map((ext) => {
    return path.join(__dirname, 'client/**/*' + ext);
  }),
  node_modules: path.join(__dirname, 'node_modules'),
  html: path.join(__dirname, 'client/index.html'),
  views: path.join(__dirname, 'server/**/*.ejs'),
  dist: path.join(__dirname, 'dist'),
  serverSource: path.join(__dirname, 'server/**/*.js'),
  serverDist: path.join(__dirname, 'server-dist')
};

gulp.task('build-dev', ['html', 'webpack:build-dev'], () => {
  gulp.watch(['client/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build-prod', ['html', 'styles', 'webpack:build']);
gulp.task('build-dev', ['html', 'styles', 'webpack:build-dev']);


gulp.task('html', () => {
  gulp.src(paths.html)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', () => {
  let processors = [
    normalizeCSS,
    atImport,
    nested,
    autoprefixer,
    csswring
  ];
  return gulp.src(paths.cssEntry)
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webpack:build', (callback) => {
  // modify some webpack config options
  let myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    // gutil.log('[webpack:build]', stats.toString({
    //   colors: true
    // }));
    callback();
  });
});

// modify some webpack config options for development mode
let myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
let devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', (callback) => {
  // run webpack
  devCompiler.run((err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});


gulp.task('webpack-dev-server', (callback) => {
  // modify some webpack config options
  let myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'source-map';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    // publicPath: '/' + myConfig.output.publicPath,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('server:build', (callback) => {
  gulp.src(paths.serverSource)
    .pipe(babel())
    .pipe(gulp.dest(paths.serverDist));
});
