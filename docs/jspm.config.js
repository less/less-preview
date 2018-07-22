SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/"
  },
  browserConfig: {
    "paths": {
      "*": "dist/*.js",
      "aurelia-skeleton-navigation/": "/src/"
    }
  },
  nodeConfig: {
    "paths": {
      "aurelia-skeleton-navigation/": "src/"
    }
  },
  devConfig: {
    "map": {
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.25"
    },
    "packages": {
      "npm:babel-runtime@5.8.38": {
        "map": {}
      }
    }
  },
  transpiler: "plugin-babel",
  babelOptions: {
    "optional": [
      "es7.decorators",
      "es7.classProperties",
      "runtime"
    ]
  },
  map: {
    "babel": "npm:babel-core@5.8.38",
    "bootstrap": "github:twbs/bootstrap@3.3.4",
    "css": "github:systemjs/plugin-css@0.1.11",
    "font-awesome": "npm:font-awesome@4.3.0"
  },
  packages: {
    "aurelia-skeleton-navigation": {
      "main": "aurelia-skeleton-navigation.js"
    },
    "github:systemjs/plugin-css@0.1.11": {
      "map": {
        "clean-css": "npm:clean-css@3.1.9"
      }
    },
    "npm:amdefine@0.1.0": {
      "map": {}
    },
    "npm:clean-css@3.1.9": {
      "map": {
        "commander": "npm:commander@2.6.0",
        "source-map": "npm:source-map@0.1.43"
      }
    },
    "npm:commander@2.6.0": {
      "map": {}
    },
    "npm:font-awesome@4.3.0": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.11"
      }
    },
    "npm:source-map@0.1.43": {
      "map": {
        "amdefine": "npm:amdefine@0.1.0"
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
    "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.6.2",
    "aurelia-framework": "github:aurelia/framework@0.13.4",
    "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
    "aurelia-loader-default": "github:aurelia/loader-default@0.9.5",
    "aurelia-logging-console": "github:aurelia/logging-console@0.6.2",
    "aurelia-templating-binding": "github:aurelia/templating-binding@0.13.2",
    "aurelia-templating-resources": "github:aurelia/templating-resources@0.13.4",
    "codemirror": "npm:codemirror@5.4.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.1",
    "path": "npm:jspm-nodelibs-path@0.2.3",
    "polymer/mutationobservers": "github:googlearchive/MutationObservers@0.4.2",
    "process": "npm:jspm-nodelibs-process@0.2.1"
  },
  packages: {
    "github:aurelia/binding@0.8.6": {
      "map": {
        "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3",
        "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "github:aurelia/dependency-injection@0.9.2": {
      "map": {
        "aurelia-logging": "github:aurelia/logging@0.6.4",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3",
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "github:aurelia/event-aggregator@0.6.2": {
      "map": {
        "aurelia-logging": "github:aurelia/logging@0.6.4"
      }
    },
    "github:aurelia/framework@0.13.4": {
      "map": {
        "aurelia-binding": "github:aurelia/binding@0.8.6",
        "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
        "aurelia-loader": "github:aurelia/loader@0.8.7",
        "aurelia-logging": "github:aurelia/logging@0.6.4",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3",
        "aurelia-path": "github:aurelia/path@0.8.1",
        "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
        "aurelia-templating": "github:aurelia/templating@0.13.16",
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "github:aurelia/loader-default@0.9.5": {
      "map": {
        "aurelia-loader": "github:aurelia/loader@0.8.7",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3"
      }
    },
    "github:aurelia/loader@0.8.7": {
      "map": {
        "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3",
        "aurelia-path": "github:aurelia/path@0.8.1",
        "core-js": "npm:core-js@0.9.18",
        "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.3"
      }
    },
    "github:aurelia/logging-console@0.6.2": {
      "map": {
        "aurelia-logging": "github:aurelia/logging@0.6.4"
      }
    },
    "github:aurelia/metadata@0.7.3": {
      "map": {
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "github:aurelia/templating-binding@0.13.2": {
      "map": {
        "aurelia-binding": "github:aurelia/binding@0.8.6",
        "aurelia-logging": "github:aurelia/logging@0.6.4",
        "aurelia-templating": "github:aurelia/templating@0.13.16"
      }
    },
    "github:aurelia/templating-resources@0.13.4": {
      "map": {
        "aurelia-binding": "github:aurelia/binding@0.8.6",
        "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
        "aurelia-logging": "github:aurelia/logging@0.6.4",
        "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
        "aurelia-templating": "github:aurelia/templating@0.13.16",
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "github:aurelia/templating@0.13.16": {
      "map": {
        "aurelia-binding": "github:aurelia/binding@0.8.6",
        "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
        "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
        "aurelia-loader": "github:aurelia/loader@0.8.7",
        "aurelia-logging": "github:aurelia/logging@0.6.4",
        "aurelia-metadata": "github:aurelia/metadata@0.7.3",
        "aurelia-path": "github:aurelia/path@0.8.1",
        "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
        "core-js": "npm:core-js@0.9.18"
      }
    },
    "npm:codemirror@5.4.0": {
      "map": {}
    },
    "npm:core-js@0.9.18": {
      "map": {
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    }
  }
});
