// Require all the things
const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      gutil       = require('gulp-util'),
      plumber     = require('gulp-plumber'),
      rename      = require('gulp-rename'),
      minifyCSS   = require('gulp-clean-css'),
      prefixer    = require('gulp-autoprefixer'),
      browserSync = require('browser-sync').create();
      cp          = require('child_process');

// Set the path variables
var base_path = './',
    src = base_path + 'definitions',
    dist = base_path + 'docs/assets',
    paths = {
        js: src + '/**/*.js',
        scss: [ src +'/main.scss',
                src +'/**/*.scss' ],
        jekyll: ['docs/*', 'docs/**/*', 'docs/**/**/*', 'docs/!_site/**/*']
    };

// Set the BrowserSync URL
const site_root = 'docs/_site';

// Compile sass to css
gulp.task('compile-sass', () => {
  gulp.src(paths.scss)
  .pipe(plumber())
  .pipe(sass({outputStyle: 'expanded'}))

  .pipe(prefixer('last 3 versions', 'ie 9'))
  .pipe(rename({dirname: dist + '/css'}))
  .pipe(gulp.dest('./'))
});

// Rebuild Jekyll
gulp.task('build-jekyll', (code) => {
  return cp.spawn('jekyll.bat', ['build', '--incremental'], { stdio: 'inherit', cwd: 'docs' }) // Adding incremental reduces build time.
    .on('error', (error) => gutil.log(gutil.colors.red(error.message)))
.on('close', code);
})

// Setup Server
gulp.task('serve', () => {
  browserSync.init({
    files: [site_root + '/*',
            site_root + '/**/*',
            site_root + '/**/**/*',
            site_root + '/**/**/**/*'],
    port: 4000,
    server: {
      baseDir: site_root
    }
  });
});

// Watch files
gulp.task('watch', () => {
  gulp.watch(paths.scss, ['compile-sass']);
  gulp.watch(paths.jekyll, ['build-jekyll']);
});

// Start Everything with the default task
gulp.task('default', [ 'compile-sass', 'build-jekyll', 'serve', 'watch' ]);