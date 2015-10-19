import path from 'path';
// import babel from 'gulp-babel';
import gulp from 'gulp';
// import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import normalizeCSS from 'postcss-normalize';
import nested from 'postcss-nested';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import csswring from 'csswring';
import del from 'del';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import notify from 'gulp-notify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';




let paths = {
  jsEntry: path.join(__dirname, 'client/app.js'),
  cssEntry: path.join(__dirname, 'client/styles.css'),
  js: [path.join(__dirname, 'client/**/*.js'), path.join(__dirname, 'client/**/*.jsx')],
  styles: path.join(__dirname, 'client/**/*.css'),
  images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].map((ext) => {
    return path.join(__dirname, 'client/**/*' + ext);
  }),
  node_modules: path.join(__dirname, 'node_modules'),
  html: path.join(__dirname, 'client/**/*.html'),
  views: path.join(__dirname, 'server/**/*.ejs'),
  dist: path.join(__dirname, 'dist'),
  serverSource: path.join(__dirname, 'server/**/*.js'),
  serverDist: path.join(__dirname, 'server-dist')
};

// Production build
gulp.task('build-prod', ['clean', 'html', 'styles', 'browserify']);
gulp.task('build-dev', ['html', 'styles', 'watchify']);


// Clean task — cleans the contents of the dist folder
gulp.task('clean', (callback) => {
  del([
    'public/**/*'
  ], callback);
});

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


gulp.task('browserify', () => {
  return browserify({
    entries: [paths.jsEntry],
    transform: [babelify],
    debug: true
  })
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    // .pipe(rename('app.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watchify', () => {

  let watcher  = watchify(browserify({
    entries: [paths.jsEntry],
    transform: [babelify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  let bundle = () => {
    return watcher.bundle()
      .pipe(source('app.min.js'))
      .pipe(buffer())
      // .pipe(rename('app.min.js'))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dist))
      .pipe(notify('Watchify has finished rebuilding script bundle'));
  };

  watcher.on('update', bundle);

  return bundle();
});

gulp.task('watch', ['watchify'], () => {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.styles, ['styles']);
});
