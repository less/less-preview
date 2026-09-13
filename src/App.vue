<script lang="ts" setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import { utoa, atou, LESS_DATA } from './utils'
import Header from '@components/Header.vue'
import Editor from '@components/Editor.vue'
import Layout from '@components/Layout.vue'

let input = $ref(LESS_DATA)
let output = $ref<string | undefined>('')
let errorMessage = $ref('')
let hash = $ref('')
// `collapseNesting` is a Less v5 option (false | 'native' | 'compact'); 4.x has
// no nesting to preserve, so the control only shows for a v5 alpha version.
let store: Less.Options & {
  activeVersion: string
  collapseNesting: false | 'native' | 'compact'
} = reactive({
  activeVersion: '4.x',
  math: 'parens-division',
  strictUnits: false,
  collapseNesting: false
})

const isV5 = () => store.activeVersion.includes('-')
let loadingLessJS = $ref(false)

const serialize = () => {
  const newHash = '#' + utoa(JSON.stringify({
    code: input,
    ...store
  }))
  history.replaceState({}, '', newHash)
}

const updateVue = () => {
  const { math, strictUnits, collapseNesting } = store
  const options: Less.Options & { collapseNesting?: false | 'native' | 'compact' } =
    { math, strictUnits }
  // Only a v5 alpha understands collapseNesting; sending it to 4.x is a no-op
  // at best, so scope it to v5 (and omit the default so 4.x behaves unchanged).
  if (isV5()) {
    options.collapseNesting = collapseNesting
  }
  window.less.render(input, options, (error, result) => {
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
      <div>
        <label>Math mode</label>
        <select v-model="store.math">
          <option>always</option>
          <option>parens-division</option>
          <option>parens</option>
        </select>
      </div>
      
      <label>
        <input type="checkbox" v-model="store.strictUnits" />
        <span>Strict units</span>
      </label>

      <div v-if="isV5()">
        <label>Collapse nesting <span class="badge">v5</span></label>
        <select v-model="store.collapseNesting">
          <option :value="false">false — keep authored nesting (default)</option>
          <option value="native">native — distribute (specificity-faithful)</option>
          <option value="compact">compact — fold runs into :is()</option>
        </select>
      </div>

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
html,
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

@base: #35495e;

body {
  background: @base;
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

.badge {
  display: inline-block;
  font-size: 0.7em;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 1px 5px;
  margin-left: 4px;
  border-radius: 3px;
  color: #fff;
  background: hsl(152, 47%, 45%);
  vertical-align: middle;
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
</style>
