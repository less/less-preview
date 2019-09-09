<template>
  <div>
    <header class="titlebar">
      <div class="title">
        Less-To-CSS Playground
        <select v-model="version">
          <option v-for="version in versions" v-bind:value="version.semver" v-bind:key="version.semver">
            {{ version.semver }}
          </option>
        </select>
      </div>
    </header>
    <section :class="{container: true, 'has-error': errorMessage, 'refresh': updateStyle}">
      <div class="editor">
        <editor
          v-model="input"
          @init="editorInit"
          lang="less"
          theme="crunch-dark"
          :options="{
            useSoftTabs: true,
            tabSize: 2
          }"
        ></editor>
      </div>
      <div class="editor">
        <editor
          v-model="output"
          @init="editorInit"
          lang="less"
          theme="crunch-dark"
          :options="{
            useSoftTabs: true,
            tabSize: 2,
            readOnly: true
          }"
        ></editor>
      </div>
    </section>
    <div v-if="errorMessage" class="error">
      {{errorMessage}}
    </div>
  </div>
</template>

<script>

import editor from 'vue2-ace-editor'

function updateVue(self, newInput) {
  let interval
  const updateWithLess = () => {
    if (window.less) {
      clearInterval(interval)
      window.less.render(newInput, {}, function(error, output) {
        if (error) {
          self.errorMessage = `${error.type}Error at ${error.line}:${error.column}: ${error.message}`;
          self.output = ''
        } else {
          self.errorMessage = ''
          self.output = output.css
        }
      })
    }
  }
  if (!window.less) {
    interval = setInterval(updateWithLess, 100)
  } else {
    updateWithLess()
  }
}

// endpoints
const CDN_URL = 'https://cdn.jsdelivr.net/npm/less'
const DATA_URL = 'https://data.jsdelivr.com/v1/package/npm/less'

// see https://medium.com/@vschroeder/javascript-how-to-execute-code-from-an-asynchronously-loaded-script-although-when-it-is-not-bebcbd6da5ea
// and https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement#Dynamically_importing_scripts
function loadScriptAsync(uri){
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = uri;
    tag.async = true;
    tag.onload = () => {
      resolve();
    };
    tag.onerror = () => {
      reject();
    };
    // `[data-less-laters]` is a script tag in `default.vue`
    var lessScriptTag = document.querySelector('[data-less-latest]');
    lessScriptTag.parentNode.insertBefore(tag, lessScriptTag);
  });
}

export default {
  data() {
    return {
      updateStyle: false,
      input:
`#lib() {
  .colors() {
    @primary: blue;
    @secondary: green;
  }
  .rules(@size) {
    border: @size solid white;
  }
}

.box when (#lib.colors[@primary] = blue) {
  width: 100px;
  height: ($width / 2);
}

.bar:extend(.box) {
  @media (min-width: 600px) {
    width: 200px;
    #lib.rules(1px);
  }
}`,
      version: '',
      versions: [],
      output: '',
      errorMessage: ''
    }
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/less')
      require('./theme-crunch-dark')
    }
  },
  components: {
    editor
  },
  mounted: function () {
    fetch(DATA_URL).then(response => response.json()).then(data => {
      const versions = data.versions.filter(semver => {
        // blacklist all `1.0.x` versions since those seem to have inconsistent and incorrect `dist/` files
        return !/^1\.0\./.test(semver);
      });
      // fill the version object with empty values
      for (const version of versions) {
        this.versions.push({
          semver: version,
          compiler: null,
        });
      }
      // setup the preloaded less version (in `default.vue` with a script tag)
      if (window.less) {
        const latest = this.versions.find(version => version.semver === data.tags.latest)
        if (latest) {
          latest.compiler = window.less;
        }
      }
      this.version = data.tags.latest;
    });
    this.$nextTick(function () {
      updateVue(this, this.input)
      this.updateStyle = true
      requestAnimationFrame(() => {
        void document.offsetHeight
        this.updateStyle = false
      })
    })
  },
  watch: {
    input(newInput) {
      if (typeof newInput === 'string') {
        updateVue(this, newInput)
      } else {
        console.warn(newInput);
      }
    },
    version(newVersion) {
      const version = this.versions.find(version => version.semver === newVersion);
      if (!version.compiler) {
        const baseUrl = `${CDN_URL}@${version.semver}/dist/`;
        const is_1_x_x = /^1\./.test(version.semver);
        const suffix = (is_1_x_x) ? `less-${version.semver}.js` : 'less.js';

        //  need to reset `window.less` for old versions
        if (is_1_x_x) {
          window.less = void(0);
        }
        loadScriptAsync(baseUrl + suffix).then(() => {
          version.compiler = window.less;
          if (is_1_x_x) {
            const compiler = window.less;
            const parser = compiler.Parser();
            compiler.version = version.semver.split('.');
            compiler.render = function render(input, options, callback) {
              parser.parse(input, function (error, tree) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, {
                    css: tree.toCSS()
                  });
                }
              });
            };
          }
          console.log(`retrieved and loaded 'less@${version.semver}'`);
        }, () => {
          console.error(`failed loading 'less@${version.semver}'`);
        });
      } else {
        window.less = version.compiler;
      }

      // kickstart compiler
      updateVue(this, this.input);
    }
  }
}
</script>

<style lang="less">
html, body {
  margin: 0;
}
@base: #35495e;
body {
  background: @base;
}
*, *::before, *::after {
  box-sizing: border-box;
}
.titlebar {
  background: lighten(@base, 5);
  height: 40px;
  border: 1px solid hsla(210, 20%, 10%, 0.5);
}
.container {
  height: calc(100vh - 40px);
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  text-align: center;
  padding: 6px 0;
  &.has-error {
    height: calc(100vh - 60px);
  }
  &.refresh {
    text-indent: 0.1px;
    -webkit-text-stroke: 0.1px transparent;
  }
}
@keyframes opac {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.error {
  color: hsl(10, 89%, 78%);
  background: hsl(10, 89%, 26%);
  height: 28px;
  padding: 2px 8px;
  position: relative;
  top: -6px;
  animation: opac 1s;
}
.editor {
  width: calc(50vw - 12px);
  border: 1px solid hsl(190, 10%, 50%);
}
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 18px;
  color: white;
  letter-spacing: 1px;
  padding: 8px 16px;
}
</style>
