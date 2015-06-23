var aurelia = require('aurelia-cli');

aurelia.command('bundle', {
  js: {
    'dist/app-bundle': {
      modules: [
        '*',
        "aurelia-dependency-injection",
        "aurelia-event-aggregator",
        "aurelia-framework",
        "aurelia-loader-default",
        "aurelia-logging-console",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "codemirror",
        "polymer/mutationobservers"
      ],
      options: {
        inject: true,
        minify: true
      }
    }
  },
  template: {
    'dist/app-bundle': {
      pattern: 'dist/*.html',
      options: {
        inject: true,
      }
    }
  }
});
