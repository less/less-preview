var gulp = require('gulp');
var paths = require('../paths');
var less = require('gulp-less');

gulp.task('less', function() {
  return gulp.src([paths.style])
    .pipe(less())
    .pipe(gulp.dest(paths.output))
});
