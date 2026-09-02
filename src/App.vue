<script lang="ts" setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import { utoa, atou, LESS_DATA } from './utils'
import Header from '@components/Header.vue'
import Editor from '@components/Editor.vue'
import Layout from '@components/Layout.vue'
import Select from '@components/Select.vue'
import { Switch } from '@headlessui/vue'

const mathOptions = ['always', 'parens-division', 'parens'].map(value => ({ value }))

let input = $ref(LESS_DATA)
let output = $ref<string | undefined>('')
let errorMessage = $ref('')
let hash = $ref('')
let store: Less.Options & { activeVersion: string } = reactive({
  activeVersion: '4.x',
  math: 'parens-division',
  strictUnits: false
})
let loadingLessJS = $ref(false)

const serialize = () => {
  const newHash = '#' + utoa(JSON.stringify({
    code: input,
    ...store
  }))
  history.replaceState({}, '', newHash)
}

const updateVue = () => {
  const { math, strictUnits } = store
  window.less.render(input, { math, strictUnits }, (error, result) => {
      if (error) {
        errorMessage = error.message
        output = ''
      } else {
        errorMessage = ''
        output = result?.css
      }
    })
}

const upLoadingLessJS = () =>{
  loadingLessJS = !loadingLessJS
}

hash = location.hash.slice(1)
if (hash) {
  const { code, ...rest } = JSON.parse(atou(hash))
  input = code
  Object.assign(store, rest)
} else {
  serialize()
}

watch(() => input, () => {
  updateVue()
  if (hash !== '') {
    serialize()
  }
})
watch(store, () => {
  updateVue()
  serialize()
})

onMounted(() => {
  nextTick(() => {
    updateVue()
  })
})

</script>
<template>
  <Header @updateVue="updateVue" :store="store" @upLoadingLessJS="upLoadingLessJS"/>
  <Layout :loadingLessJS="loadingLessJS">
    <template #edit>
      <editor v-model:value="input" />
    </template>
    <template #options>
      <h3>Options</h3>
      <div class="option">
        <span>Math mode</span>
        <Select v-model="store.math" :options="mathOptions" />
      </div>
      <Switch
        v-model="store.strictUnits"
        class="option switch"
        :class="{ on: store.strictUnits }"
      >
        <span>Strict units</span>
        <span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
      </Switch>
    </template>
    <template #preview>
      <editor v-model:value="output" readOnly />
    </template>
    <template #footer>
      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </template>
  </Layout>
</template>
<style lang="less">
@import './theme.less';

html,
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

body {
  background: @base;
  color: @text;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

@keyframes opac {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.options {
  h3 {
    font-family: @font;
    font-weight: 300;
    letter-spacing: 1px;
    color: white;
  }
  .option {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: @muted;
  }
  .switch {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: @muted;
    cursor: pointer;
    &:focus-visible .switch-track {
      outline: 2px solid @accent;
      outline-offset: 1px;
    }
  }
  .switch-track {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: darken(@base, 10%);
    border: 1px solid lighten(@base, 12%);
    transition: background 0.15s;
  }
  .switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: @muted;
    transition: transform 0.15s, background 0.15s;
  }
  .switch.on {
    .switch-track {
      background: @accent;
      border-color: @accent;
    }
    .switch-thumb {
      background: white;
      transform: translateX(16px);
    }
  }
}

.error {
  color: hsl(10, 89%, 78%);
  background: hsl(10, 89%, 26%);
  border-top: 1px solid @border;
  padding: 6px 12px;
  font-size: 14px;
  font-family: @font;
  animation: opac 0.3s;
}
</style>
