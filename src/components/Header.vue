<script setup lang="ts">
import axios from "axios";
import { atLeast } from "../options";
import Select from "./Select.vue";
const props = defineProps(["store"]);
const { store } = props;

const baseVersionUrl = "https://cdn.jsdelivr.net/npm/less@";
// First Less alpha whose npm package includes dist/less-browser-dev.js.
const MIN_BROWSER_BUNDLE_ALPHA = "5.0.0-alpha.3";
let activeVersion = $ref("");
let publishedVersions = $ref<string[]>();
let showTipFlag = $ref(false);
let versionSelectFail = $ref(false);
const emit = defineEmits(["updateVue", 'upLoadingLessJS']);
let majorMinorSet = new Set<string>()
const versionLabel = (v: string) => v.includes("-") ? `${v} (experimental)` : v;
const versionOptions = $computed(() =>
  (publishedVersions ?? []).map((v) => ({ value: v, label: versionLabel(v) }))
);

async function fetchVersions() {
  let { data } = await axios.get(
    `https://data.jsdelivr.com/v1/package/npm/less`
  );
  if (!data) {
    let networkErrorMessage = "NetworkError, less versions can't find";
    return { networkErrorMessage };
  }
  publishedVersions = data.versions.filter((v: string) => {
    // Only offer stable releases from the main npm tags: drop prereleases
    // (e.g. 5.0.0-alpha.1, 4.0.1-alpha.2 -- they only ship a Node/CJS build
    // that a browser <script> can't execute), drop <3.x, and dedupe by minor.
    if (v.includes('-')) {
      return false;
    }
    const majorMinor = v.match(/^\d+\.\d+/)?.[0] || '';
    if (Number(majorMinor.charAt(0)) < 3 || majorMinorSet.has(majorMinor)) {
      return false;
    }
    majorMinorSet.add(majorMinor);
    return true
  });
  // Opt-in: surface the latest v5 alpha (npm `alpha` dist-tag). It loads the
  // dev browser bundle (dist/less-browser-dev.js, window.less) — see fetchLess.
  // Like the Less benchmark runner's per-file minimum versions, only offer an
  // alpha that actually ships that file; older alphas would just 404.
  // Kept out of the default so stable (`latest`) stays the landing version.
  const alpha = data.tags?.alpha;
  if (alpha && atLeast(alpha, MIN_BROWSER_BUNDLE_ALPHA) && !publishedVersions.includes(alpha)) {
    publishedVersions.unshift(alpha);
  }
  // Default to the npm `latest` dist-tag (stable, currently 4.x), never a prerelease.
  const latest = data.tags?.latest;
  const defaultVersion = (latest && publishedVersions.includes(latest))
    ? latest
    : publishedVersions[0];
  if (!store.activeVersion || store.activeVersion === '4.x' || !publishedVersions.includes(store.activeVersion)) {
    activeVersion = defaultVersion;
    store.activeVersion = activeVersion;
  } else {
    activeVersion = store.activeVersion;
  }
}

function fetchLess() {
  emit("upLoadingLessJS");
  // v5 alpha (any prerelease) ships only a Node/CJS default entry; a browser
  // <script> must load the dedicated dev bundle instead. Stable 4.x loads its
  // normal UMD entry. Both define window.less with the same render API.
  const url = activeVersion.includes("-")
    ? `${baseVersionUrl}${activeVersion}/dist/less-browser-dev.js`
    : baseVersionUrl + activeVersion;
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
    // Balance the loading toggle emitted at the start of fetchLess so a failed
    // load never leaves the spinner stuck on (otherwise the whole page bricks),
    // and re-render with whatever `window.less` is currently loaded.
    emit("updateVue");
    emit("upLoadingLessJS");
  };
}

function showTip() {
  showTipFlag = true;
  setTimeout(() => {
    versionSelectFail = false;
    showTipFlag = false;
  }, 2000);
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
        <span>Version</span>
        <Select
          :modelValue="activeVersion"
          :options="versionOptions"
          @update:modelValue="setLessVersion"
        />
      </div>
      <button title="CopyLink" class="control button iconfont" @click="copyLink">
        &#xe616;
      </button>
      <button title="Go to less-preview repo" class="control button">
        <a
          href="https://github.com/less/less-preview"
          target="_blank"
          class="iconfont"
          >&#xe885;
        </a>
      </button>
      <button title="Go to less issue" class="control button">
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
@import (reference) "../theme.less";
@font-face {
  font-family: "iconfont";
  src: url("../assets/iconfont.ttf") format("truetype");
}
.titlebar {
  position: relative;
  z-index: 10;
  background: lighten(@base, 5);
  height: 40px;
  border: 1px solid @border;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  font-family: @font;
  color: white;
  .logo {
    flex: none;
    width: 52.8px;
    height: 23.4px;
    background: url("../assets/less_logo.png") no-repeat;
    background-size: 52.8px 23.4px;
  }

  .title {
    flex: 1;
    font-weight: 300;
    font-size: 18px;
    letter-spacing: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    .toolbar {
      margin-left: auto;
    }
  }

  .version-select-tips {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    padding: 8px 16px;
    border-radius: @radius;
    font-size: 15px;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    .version-select-tips-error {
      color: #f26b6e;
    }
    .version-select-tips-success {
      color: @accent;
    }
    background: @panel;
    border: 1px solid @border;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    .version-select {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 0;
      .select {
        width: 14rem;
      }
    }
    .button {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      a {
        text-decoration: none;
        color: inherit;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
