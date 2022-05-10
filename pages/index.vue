<template>
  <div>
    <header class="titlebar">
      <div class="title">Less-To-CSS Playground</div>
      <div class="version-select">
        Version: 
        <div class="version-select-click" @click.stop @click="toggle">
          <span class="active-version">
            {{ version }}
          </span>
          <ul v-if="expanded" class="versions">
            <li v-for="(item, index) in options" :key='index'>
              <a @click="setVersion(item)">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <section
      :class="{
        container: true,
        'has-error': errorMessage,
        refresh: updateStyle
      }"
    >
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
    <div v-if="networkErrorMessage" class="error">
      {{ networkErrorMessage }}
    </div>
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
    <!-- <script :src="Url" id="lessScript"></script> -->
  </div>
</template>

<script>

import editor from 'vue2-ace-editor'
import axios from 'axios'

function updateVue(self, newInput) {
  let interval
  const updateWithLess = () => {
    if (window.less) {
      clearInterval(interval)
      window.less.render(newInput, {}, function(error, output) {
        if (error) {
          self.errorMessage = error.message
          self.output = ""
        } else {
          self.errorMessage = ""
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

export default {
  data() {
    const baseVersionUrl = "https://cdn.jsdelivr.net/npm/less@"
    const defaultVersion = "3"
    let Url = baseVersionUrl + defaultVersion
    return {
      updateStyle: false,
      expanded: false,
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
      output: "",
      errorMessage: "",
      networkErrorMessage: "",
      versions: [],
      baseVersionUrl,
      defaultVersion,
      Url,
      version:'',
      options: [],
    }
  },
  methods: {
    toggle: function() {
      this.expanded= !this.expanded
    },
    setVersion: function(version) {
      this.version = version
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/less')
      require('./theme-crunch-dark')
    }
  },
  components: {
    editor
  },
  mounted: function() {
    this.$nextTick(function() {
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
      updateVue(this, newInput)
    },
    version(newVersion) {
      this.Url = this.baseVersionUrl + newVersion
      const scriptDom = document.getElementById("lessScript")
      if (scriptDom) {
        scriptDom.parentNode.removeChild(scriptDom)
      }
      const newScript = document.createElement("script")
      newScript.src = this.Url;
      newScript.id = "lessScript"
      document.body.appendChild(newScript)

      //IE
      if (newScript.readyState) {
        newScript.onreadystatechange = () => {
          if (
            newScript.readyState == "complete" 
            || newScript.readyState == "loaded"
          ) {
            newScript.onreadystatechange = null
            updateVue(this, this.input)
          }
        };
      } else {
        newScript.onload = () => {
          updateVue(this, this.input)
        }
      }
    }
  },
  created: function() {
    this.version = this.versions[0]
    this.options = this.versions
    this.Url = this.baseVersionUrl + this.version
  },
  async asyncData() {
    let { data } = await axios.get(
      `https://data.jsdelivr.com/v1/package/npm/less`
    )
    if (!data) {
      let networkErrorMessage = "NetworkError, less versions can't find"
      return { networkErrorMessage }
    }
    return { versions: data.versions }
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
  position: relative;
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
.version-select{
  position: absolute;
  right: 200px;
  top: 30%;
  transform: translateY(-50%);
  width: 10rem;
  z-index: 100;
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 18px;
  color: white;
  letter-spacing: 1px;
  padding: 8px 16px;
  height: 25px;
  line-height: 25px;
}
.version-select-click {
  position: absolute;
  color: black;
  background-color: #e6e8eb;
  display: inline-block;
  margin-right: 12px;
  width: 200px;
  height: 25px;
  line-height: 25px;
}
.active-version {
  cursor: pointer;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  line-height: 25px;
  padding-right: 0;
}
.active-version:after {
  content: '';
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #aaa;
  position: absolute;
  right: 2px;
  top: 6px;
}

.versions {
  position: absolute;
  left: 0;
  top: 40px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
  width: 200px;
  max-height: calc(100vh - 70px);
  overflow: scroll;
  background-color: #e6e8eb;
}
.versions a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  cursor: pointer;
  color: var(--base);
}
.versions a:hover {
  color: #3ca877;
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
