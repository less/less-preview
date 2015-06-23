var path = require('path');

var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/main.less',
  output: outputRoot,
  sourceMapRelativePath: '../' + appRoot,
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  bundleSrc: ['config.js', 'favicon.ico', 'index.html', 'dist/app-bundle.html', 'dist/app-bundle.js',
    'jspm_packages/es6-module-loader.js', 'jspm_packages/system.js'],
  bundleOutput: './www/'
};
