var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    coffeex = require('gulp-coffee-react'),
    imagemin = require('gulp-imagemin'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    notify = require('gulp-notify'),
    order = require("gulp-order"),
    // jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    spawn = require("gulp-spawn"),
    server = require('gulp-server-livereload'),
    minifyCss = require('gulp-minify-css');

gulp.task('default', function () {
  gulp.watch(['./src/sass/**/*.scss', './src/**/*.css'], ['stylesheet']);
  gulp.watch('./src/react/**/*.cjsx', ['javascript:react']);
  gulp.watch('./server/*.coffee', ['game-server']);
});

// Javascript stuff
gulp.task('game-server', function() {
  gulp.src('./server/**/*.coffee')
      .pipe(gulpif(/[.]coffee$/, coffeex({ bare: true }).on('error', gutil.log)))
      .pipe(order([
        "server/*.js",
        "server/server.js"
      ], { base: '.' }))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./server/'))
});

// Javascript stuff
gulp.task('coffeex', function() {
  gulp.src('./src/react/**/*.cjsx')
      .pipe(coffeex({ bare: true }).on('error', gutil.log))
      .pipe(gulp.dest('./src/js/react/'))
});

gulp.task('javascript:react', function() {
  gulp.src(['./src/js/*.js', './src/react/**/*.cjsx'])
      .pipe(gulpif(/[.]cjsx$/, coffeex({ bare: true }).on('error', gutil.log)))
      .pipe(debug({title: 'JS:'}))
      .pipe(order([
        "src/js/*.js",
        "src/react/components/**/*.js",
        "src/js/react/*.js",
        "src/js/react/app.js"
      ], { base: '.' }))
      .pipe(uglify())
      .pipe(concat('assets/js/app.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('javascript:vendor', function() {
  gulp.src(['src/js/vendor/*.js'])
      .pipe(uglify())
      .pipe(concat('assets/js/vendor.js'))
      .pipe(gulp.dest('./dist/'));
});


// Stylesheet stuff
gulp.task('stylesheet', function() {
  gulp.src(['./src/sass/**/*.scss', "src/css/vendor/*.css"])
      .pipe(sass().on('error', sass.logError))
      .pipe(order([
        "src/css/vendor/*.css",
        "src/css/*.css"
      ], { base: '.' }))
      .pipe(minifyCss())
      .pipe(debug({title: 'Stylesheet:'}))
      .pipe(concat('assets/css/app.css'))
      .pipe(gulp.dest('./dist/'));

  notify({ message: 'Styles compiled' })
});

// Image stuff
gulp.task('images', function() {
  gulp.src('./src/images/**/*')
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dist/images'));

  notify({ message: 'Images task complete' })
});

// Fonts
gulp.task('fonts', function() {
  gulp.src('./src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
  notify({ message: 'Fonts transfered' })
});

gulp.task('sprites', function() {
  [1,2,3,4,5].map(function(multiplier) {
    gulp.src("./src/images/sprites/**/*.png")
        .pipe(spawn({
          cmd: "convert",
          args: [
            "-",
            "-interpolate", "Nearest",
            "-filter", "point",
            "-resize", multiplier+"00%",
            "-",
          ],
        }))
        .pipe(gulp.dest("./dist/images/sprites/"+multiplier+"x/"));
  })
  notify({ message: 'Sprites completed' })
});

gulp.task('webserver', function() {
  gulp.src('dist').pipe(server({
    livereload: true,
    defaultFile: 'index.html',
    directoryListing: true,
    open: true
  }));
});
