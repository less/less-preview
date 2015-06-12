var gulp = require('gulp');
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
    require('fs').writeFileSync('dist/less-versions.js', templateStart + stdout.trim() + templateEnd);
    cb(err);
  });
});
