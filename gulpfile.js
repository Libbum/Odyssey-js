var gulp   = require('gulp');
var coffee = require("gulp-coffee");
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var nano = require('gulp-cssnano');

var jshint = require('gulp-jshint');
var jstylish = require('jshint-stylish');
var coffeelint = require('gulp-coffeelint');
var cstylish = require('coffeelint-stylish');

gulp.task('lint', function () {
    gulp.src(['./src/lib/control.js', './src/lib/globe.js', './src/lib/galleryctl.js', './src/lib/util.js', './src/lib/jquery.modal.js', './src/chromatic/lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(jstylish));
    gulp.src(['./src/chromatic/views/**.coffee', './src/chromatic/plugin.coffee'])
        .pipe(coffeelint())
        .pipe(coffeelint.reporter(cstylish));
});

gulp.task('lintcjs', function () {
    gulp.src('./src/lib/chromatic.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jstylish));
});

gulp.task('coffee', function() {
  return gulp.src(['./src/chromatic/views/**.coffee', './src/chromatic/plugin.coffee'])
    .pipe(coffee())
    .pipe(concat('plugin.js'))
    .pipe(gulp.dest('./src/chromatic/build'))
})

gulp.task('chromatic', ['coffee'], function() {
  return gulp.src(['./src/chromatic/lib/*.js', './src/chromatic/build/plugin.js'])
    .pipe(concat('chromatic.js'))
    .pipe(gulp.dest('./src/lib/'))
})

gulp.task('javascript', ['chromatic'], function() {
  return gulp.src(['./src/lib/*.js'])
    //.pipe(uglify())
    .pipe(concat('odyssey.js'))
    .pipe(gulp.dest('./dist/assets/js/'))
})

gulp.task('css', function () {
  return gulp.src(['./src/sass/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(uncss({
        html: ['./dist/index.html'],
        ignore: [/chromatic-.*/, /iglobe-.*/, '#map', '.modal', /modal-.*/, '.modal a.close-modal', '.blocker', '.blocker:before', '#titleBar', '#gallery div', '.fa-chevron-up', '.toggle']
    }))
    .pipe(nano())
    .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('build-and-clean', ['javascript', 'css'], function() {
  del(['./src/chromatic/build']);
})

gulp.task('default', ['build-and-clean'])
