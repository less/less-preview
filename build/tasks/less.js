var gulp = require('gulp');
var paths = require('../paths');
var less = require('gulp-less');
var autoprefix = require('less-plugin-autoprefix');
var cleancss = require('less-plugin-clean-css');

gulp.task('less', function() {
  return gulp.src([paths.style])
    .pipe(less({
      plugins: [new autoprefix( { browsers: ["last 3 versions"] } ), new cleancss( { advanced: true} )]
    }))
    .pipe(gulp.dest(paths.output))
});
