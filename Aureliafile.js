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
        "aurelia-html-template-element",
        "codemirror",
        "polymer/mutationobservers",
        "github:webcomponents/webcomponentsjs@0.6.3/HTMLImports.min",
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
