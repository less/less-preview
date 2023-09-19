<script setup lang="ts">
import axios from "axios";
const props = defineProps(["store"]);
const { store } = props;

const baseVersionUrl = "https://cdn.jsdelivr.net/npm/less@";
let activeVersion = $ref("");
let publishedVersions = $ref<string[]>();
let expanded = $ref(false);
let showTipFlag = $ref(false);
let versionSelectFail = $ref(false);
const emit = defineEmits(["updateVue", 'upLoadingLessJS']);
let majorMinorSet = new Set<string>()

async function fetchVersions() {
  let { data } = await axios.get(
    `https://data.jsdelivr.com/v1/package/npm/less`
  );
  if (!data) {
    let networkErrorMessage = "NetworkError, less versions can't find";
    return { networkErrorMessage };
  }
  publishedVersions = data.versions.filter((v: string) => {
    const majorMinor = v.match(/^\d+\.\d+/)?.[0] || '';
    if (Number(majorMinor.charAt(0)) < 3 || majorMinorSet.has(majorMinor)) {
      return false;
    }
    majorMinorSet.add(majorMinor);
    return true
  });
  if (!store.activeVersion || store.activeVersion === '4.x' || !publishedVersions.includes(store.activeVersion)) {
    activeVersion = publishedVersions[0];
    store.activeVersion = activeVersion;
  } else {
    activeVersion = store.activeVersion;
  }
}

function fetchLess() {
  emit("upLoadingLessJS");
  const url = baseVersionUrl + activeVersion;
  let firstLoad = false;
  const scriptDom = document.getElementById("lessScript");
  if (scriptDom) {
    scriptDom.parentNode?.removeChild(scriptDom);
  } else {
    firstLoad = true;
  }
  const newScript = document.createElement("script");
  newScript.src = url;
  newScript.id = "lessScript";
  document.body.appendChild(newScript);

  newScript.onload = () => {
    if (!firstLoad) {
      versionSelectFail = false;
      showTip();
    }
    emit("updateVue");
    emit("upLoadingLessJS");
  };
  newScript.onerror = () => {
    if (!firstLoad) {
      versionSelectFail = true;
      showTip();
    }
  };
}

function showTip() {
  showTipFlag = true;
  setTimeout(() => {
    versionSelectFail = false;
    showTipFlag = false;
  }, 2000);
}

async function toggle() {
  expanded = !expanded;
}

async function setLessVersion(v: string) {
  activeVersion = v;
  store.activeVersion = v;
  fetchLess();
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href);
  alert("Sharable URL has been copied to clipboard.");
}

async function init() {
  await fetchVersions();
  fetchLess();
}
init();
</script>

<template>
  <header class="titlebar">
    <div class="logo"></div>
    <div class="title">Less-To-CSS Playground</div>
    <transition name="fade">
      <div v-if="showTipFlag" class="version-select-tips">
        <div v-if="versionSelectFail" class="version-select-tips-error">
          <span class="iconfont">&#xe62f;</span>
          Failed to load version: {{ activeVersion }}
        </div>
        <div v-else class="version-select-tips-success">
          <span class="iconfont">&#xe679;</span>
          Successfully switched version: {{ activeVersion }}
        </div>
      </div>
    </transition>
    <div class="toolbar">
      <div class="version-select">
        Version:
        <!--
          TODO - use a plain select box instead of this one which has
          weird / non-standard behavior.
        -->
        <div class="version-select-click" @click.stop @click="toggle">
          <span class="active-version">
            {{ activeVersion }}
          </span>
          <ul v-if="expanded" class="versions">
            <li v-for="(item, index) in publishedVersions" :key="index">
              <a @click="setLessVersion(item)">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
      <button title="CopyLink" class="github button iconfont" @click="copyLink">
        &#xe616;
      </button>
      <button title="Go to less-preview repo" class="github button">
        <a
          href="https://github.com/less/less-preview"
          target="_blank"
          class="iconfont"
          >&#xe885;
        </a>
      </button>
      <button title="Go to less issue" class="github button">
        <a
          href="https://github.com/less/less.js/issues"
          target="_blank"
          class="iconfont"
          >&#xe76d;
        </a>
      </button>
    </div>
  </header>
</template>

<style lang="less">
@base: #35495e;
@font-face {
  font-family: "iconfont";
  src: url("../assets/iconfont.ttf") format("truetype");
}
.titlebar {
  position: relative;
  background: lighten(@base, 5);
  height: 40px;
  border: 1px solid hsla(210, 20%, 10%, 0.5);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .logo {
    position: absolute;
    display: inline-block;
    width: 52.8px;
    height: 23.4px;
    background-image: url("../assets/less_logo.png");
    background-size: 52.8px 23.4px;
    background-repeat: no-repeat;
    margin-left: 3px;
    margin-top: 8px;
  }

  .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      sans-serif; /* 1 */
    font-weight: 300;
    font-size: 18px;
    color: white;
    letter-spacing: 1px;
    padding: 8px 16px;
    margin-left: 54px;
  }
  @media (max-width: 720px) {
    .title {
      font-size: 0.8em;
    }
  }

  @media (max-width: 640px) {
    .title {
      display: none;
    }
  }
  .version-select-tips {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    z-index: 100;
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: 18px;
    letter-spacing: 1px;
    margin-top: 6px;
    line-height: 18px;
    .version-select-tips-error {
      width: 100%;
      height: 100%;
      padding: 6px 16px;
      border-radius: 3px;
      color: #f26b6e;
      background-color: #fef0f0;
    }
    .version-select-tips-success {
      width: 100%;
      height: 100%;
      padding: 6px 16px;
      border-radius: 3px;
      color: #6bc247;
      background-color: #e2f3d9;
    }
  }
    @media (max-width: 560px) {
    .toolbar {
      font-size: 0.8em;
    }
  }

  @media (max-width: 640px) {
    .toolbar {
          margin-left:54PX;
    }
  }
  .toolbar {
    width: 25rem;
    z-index: 100;
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: 18px;
    color: white;
    letter-spacing: 1px;
    padding: 4px 10px;
    height: 25px;
    line-height: 25px;
    .version-select {
      display: inline-block;
      cursor: default;
      .version-select-click {
        position: relative;
        color: black;
        background-color: #e6e8eb;
        display: inline-block;
        margin-right: 12px;
        width: 200px;
        height: 25px;
        line-height: 25px;
        .active-version {
          cursor: pointer;
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 100%;
          line-height: 25px;
          padding-left: 5px;
          &:after {
            content: "";
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid #aaa;
            position: absolute;
            right: 2px;
            top: 6px;
          }
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
          a {
            display: block;
            padding: 6px 12px;
            text-decoration: none;
            cursor: pointer;
            color: var(--base);
            &:hover {
              color: #3ca877;
            }
          }
        }
      }
    }
    .github {
      a {
        text-decoration: none;
        color: #fff;
      }
    }
    .button {
      display: inline-block;
      width: 20px;
      height: 20px;
      cursor: default;
      margin-left: 1px;
      margin-right: 2px;
      text-decoration: none;
      color: #fff;
      background: none;
      border: none;
      text-align:center;
      &:hover {
        font-weight: 600;
      }
    }
  }
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
