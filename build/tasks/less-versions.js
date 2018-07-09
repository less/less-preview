var gulp = require('gulp');
var semver = require('semver');
var exec = require('child_process').exec;

gulp.task('less-versions', function (cb) {

  var templateStart = "System.register([], function (_export) {\n" +
    "  return {\n" +
    "    setters: [],\n" +
    "    execute: function () {\n" +
    "      _export('default', \n";

  var templateEnd = ");\n" +
    "    }\n" +
    "  };\n" +
    "});\n";

  exec('npm view less versions', function (err, stdout, stderr) {
    var validVersions = Object.create(null);
    var versionArray = [];
    var versions = JSON.parse(stdout.trim().replace(/'/g, '"'));
    versions.forEach(function(version) {
      var prefix = '^' + semver.major(version) + '.' + semver.minor(version) + '.0';
      if (semver.satisfies(version, prefix)) {
        validVersions[prefix] = version;
      }
    });
    for (var prop in validVersions) {
      versionArray.push(validVersions[prop]);
    }
    require('fs').writeFileSync('dist/less-versions.js', templateStart + JSON.stringify(versionArray)+ templateEnd);
    cb(err);
  });
});
