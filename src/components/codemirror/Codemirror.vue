<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { basicSetup, EditorView,  } from "codemirror"
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'

interface Props {
  value?: string
  theme?: string
  readOnly?: boolean
}

const el = $ref<Element>()
let editor = $ref<EditorView>()
const { value, theme, readOnly = false } = defineProps<Props>()
const emit = defineEmits<(e: 'input', value: string) => void>()

onMounted(() => {
  editor = new EditorView({
    doc: value,
    extensions: [
      basicSetup,
      css(),
      oneDark,
      EditorView.contentAttributes.of({ contenteditable: readOnly ? 'false' : 'true'}),
      EditorView.updateListener.of((v) => {
        const localValue = v.state.doc.toString();
        emit('input', localValue);
      })
    ],
    parent: el
  })
})

watch(() => value, () => {
  if (readOnly) {
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value }
    })
  }
})
</script>
<template>
  <div class="codemirror" ref="el"/>
</template>
<style lang="less">
.codemirror {
  height: 100%;
  .cm-editor {
    height: 100%;
  }
}
</style>