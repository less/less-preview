<template>
  <div>
    <header class="titlebar">
      <div class="title">Less Preview</div>
    </header>
    <section :class="{container: true, 'has-error': errorMessage}">
      <div class="editor">
        <editor
          v-model="input"
          @init="editorInit"
          lang="less"
          theme="tomorrow_night"
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
          theme="tomorrow_night"
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

export default {
  data() {
    return {
      input: 'test',
      output: '',
      errorMessage: ''
    }
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/less')
      require('brace/theme/tomorrow_night')
    }
  },
  components: {
    editor
  },
  watch: {
    input(newInput) {
      var self = this
      less.render(newInput, {}, function(error, output) {
        if (error) {
          self.errorMessage = error.message
          self.output = ''
        } else {
          self.errorMessage = ''
          self.output = output.css
        }
      })
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
