<template>
  <Header @updateVue="updateVue" :store="store" />
  <Layout>
    <template #edit>
      <editor v-model:value="input" />
    </template>
    <template #preview>
      <editor v-model:value="output" readOnly />
    </template>
  </Layout>
  <div v-if="errorMessage" class="error">
    {{ errorMessage }}
  </div>
</template>

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

let updateWithLessInterval = setInterval(() => { }, 100)

const serialize = () => {
  const newHash = '#' + utoa(JSON.stringify({
    code: input,
    activeVersion: store.activeVersion
  }))
  history.replaceState({}, '', newHash)
}

const updateWithLess = () => {
  if (window.less) {
    clearInterval(updateWithLessInterval)
    serialize()
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
}

const updateVue = () => {
  if (!window.less) {
    updateWithLessInterval = setInterval(updateWithLess, 100)
  } else {
    updateWithLess()
  }
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
