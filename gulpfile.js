var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var nano = require('gulp-cssnano');

gulp.task('javascripttop', function() {
  return gulp.src(['./src/lib/jquery.modal.min.js', './src/lib/chromatic.js'])
    .pipe(uglify())
    .pipe(concat('odysseytop.js'))
    .pipe(gulp.dest('./dist/assets/js/'))
})

gulp.task('javascriptbottom', function() {
  return gulp.src(['./src/lib/main.js', './src/lib/util.js'])
    .pipe(uglify())
    .pipe(concat('odysseybottom.js'))
    .pipe(gulp.dest('./dist/assets/js/'))
})

gulp.task('css', function () {
  return gulp.src(['./src/sass/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(uncss({
        html: ['./dist/index.html'],
        ignore: [/chromatic-.*/, /iglobe-.*/, '#map', '.modal', /modal-.*/, '.modal a.close-modal', '.blocker', '.blocker:before', '#titleBar', '#gallery div']
    }))
    .pipe(nano())
    .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('default', ['javascripttop', 'javascriptbottom', 'css'])
