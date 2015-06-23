var gulp = require('gulp');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var paths = require('../paths');

gulp.task('bundle-cmd', ['build'], function(callback) {
  exec('node node_modules/aurelia-cli/bin/aurelia bundle', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});

// copies changed html files to the output directory
gulp.task('bundle-copy', function () {
  return gulp.src(paths.bundleSrc, { base: './' })
    .pipe(gulp.dest(paths.bundleOutput));
});

gulp.task('bundle-post-revert', function(callback) {
  exec('git checkout -- config.js index.html', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});

gulp.task('bundle', function() {
  return runSequence(
    'bundle-cmd',
    'bundle-copy',
    'bundle-post-revert'
  );
});
