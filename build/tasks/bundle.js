var gulp = require('gulp');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var paths = require('../paths');

gulp.task('bundle-cmd', ['build', 'clean-bundle'], function(callback) {
  exec('node node_modules/aurelia-cli/bin/aurelia-cli bundle', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});

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

gulp.task('switch-to-gh-pages', function(callback) {
  exec('git checkout gh-pages -f', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});

gulp.task('publish-copy', function () {
  return gulp.src(paths.bundleOutput + "**/*")
    .pipe(gulp.dest("./"));
});

gulp.task('publish', function() {
  return runSequence(
    'clean',
    'switch-to-gh-pages',
    'clean-jspm-packages',
    'publish-copy',
    'clean-bundle'
  );
});

