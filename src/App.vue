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
let store = reactive({ activeVersion: '4.x' })
let loadingLessJS = $ref(false)

const serialize = () => {
  const newHash = '#' + utoa(JSON.stringify({
    code: input,
    activeVersion: store.activeVersion
  }))
  history.replaceState({}, '', newHash)
}

const updateVue = () => {
  window.less.render(input, {}, (error, result) => {
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
  const saved = JSON.parse(atou(hash))
  input = saved.code
  store = saved
} else {
  serialize()
}

watch(() => input, () => {
  updateVue()
  if (hash !== '') {
    serialize()
  }
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
